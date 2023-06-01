from fastapi import APIRouter, HTTPException,status, Depends
from api.utils.hashing import password_hash, verify_password
from api.utils.token import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from api.utils.email import send_mail
from api.database import get_db
from datetime import timedelta
from jose import jwt, JWTError
from api import models
from dotenv import load_dotenv
from datetime import datetime
from api import schemas
from uuid import uuid4
import os


router = APIRouter(tags=['Auth'])

oauth2_scheme = OAuth2PasswordBearer(
        tokenUrl='/auth/login',
        scheme_name="JWT"
    )

load_dotenv()
SECRET_KEY = os.getenv('JWT_SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES')

# User login route
@router.post('/auth/login')
async def login(request: OAuth2PasswordRequestForm = Depends(), 
                db: Session = Depends(get_db)):
    # Check if the user exists
    user = db.query(models.User).filter(
        models.User.email == request.username
    ).first()

    # If user or password does not exist, return an error
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User with email does not exist!"
        )
    
    # Verify the user's password
    password = verify_password(request.password, user.password)

    if not password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Email or password incorrect!"
        )

    # Check if their account is verified, if not, they cannot login
    if user.is_verified == False:
        return {
            "message": "Please verify your account before logging in!"
        }

    # Generate an access token for the user
    access_token_expires = timedelta(minutes=float(ACCESS_TOKEN_EXPIRE_MINUTES))
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return {"user": user, "access_token": access_token}

# Route for account verification
# it verifies users access token sent via email.
@router.get('/auth/verify-token')
async def verify_token(token, db: Session = Depends(get_db)):

    # Create a payload and decode the token recieved from the user
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token {e}",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Get user email from the payload
    user_email =  payload.get("sub")

    user = db.query(models.User).filter(models.User.email == user_email).first()
    
    # Check if the user exists, if not, return an error
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User does not exist!"
        )
    
    # Change the users verification status to True
    if not user.is_verified:
        user.is_verified = True
        db.commit()
        db.close()

    return {
        "message": "Account verified successfully!"
    }

# This route is to initialize reset password
@router.post("/auth/reset-password-init")
async def reset_password_init(request: schemas.ResetPasswordInit, 
                                db: Session = Depends(get_db)):
        # Check if the user's email exist in the database
        user = db.query(models.User).filter(
            models.User.email == request.email).first()


        # Check if user does not exist
        if not user:
            return HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User does not exist!"
            )
        # Generate a uuid code
        code=str(uuid4())

        # Check if user already exist in the PasswordReset table
        reset_email = db.query(models.PasswordReset).filter(
            models.PasswordReset.email == request.email
        ).first()
        
        # Email url and content to be sent
        url = f"http://localhost:8000/finalize-password-reset?code={code}"

        if reset_email:

            url1 = f"http://localhost:8000/finalize-password-reset?code={reset_email.code}"

            await send_reset_email(url=url1, user=user, request=request)

            return {
                "message": "A link to reset your password has been sent to your email!",
            }

        # If user exist, add their email to the password reset 
        # table and generate a unique token for them
        reset_details = models.PasswordReset(
            email=request.email,
            code=code,
            date_created=datetime.utcnow()
        )

        await send_reset_email(url=url, user=user, request=request)

        
        db.add(reset_details)
        db.commit()
        db.close()

        return {
            "message": "A link to reset your password has been sent to your email!",
        }

# Finalize password reset
@router.post("/auth/finalize-password-reset")
async def finalize_password_reset(
        request: schemas.FinalizeResetPassword,
        db: Session = Depends(get_db)
    ):

    reset_code = db.query(models.PasswordReset).filter(
        models.PasswordReset.code == request.code
    ).first()

    if not reset_code:
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid token!"
        )

    user = db.query(models.User).filter(
        models.User.email == reset_code.email
    ).first()

    user.password = password_hash(request.new_password)

    db.add(user)
    db.delete(reset_code)
    db.commit()
    db.close()

    return {
        "message": "Password has been updated successfully!"
    }


# This function is for protected routes.
#   It validates user's access token to determine 
#   if they can access protected routes
def get_current_user(token: str = Depends(oauth2_scheme),
                        db: Session = Depends(get_db)) -> models.User:

    # Exception to be raised if the token or user is not valid
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Decode the access token to see if it is valid
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            options={"verify_aud": False},
        )
        # Get user email from the payload
        user_email: str = payload.get("sub")
    except JWTError:
        raise credentials_exception

    # Validate if the user actually exists in the database
    user = db.query(models.User).filter(models.User.email == user_email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find user!"
        )
    return user

# Email template for password reset
async def send_reset_email(url: str, user, request):

    content = f"""
            <html>
            <body>
                <b>Hi {user.name}</b></br>
                <p>You jsut requested for a password reset, kinkly click 
                    <a href="{url}">here</a> to reset your password.
                </p>
                <p>In case you missed the link, here it is -> {url}</p>
        
            </body>
            </html>
        """
            
    await send_mail(email=request.email, content=content)