from fastapi import APIRouter, HTTPException, status, Depends
from api.utils.hashing import password_hash
from sqlalchemy.orm import Session
from sqlalchemy import exc
from api.database import get_db
from api.utils.email import send_mail
from jose import jwt
from api import models
from dotenv import load_dotenv
from api import schemas
from uuid import uuid4
import os


router = APIRouter(tags=['User'])

load_dotenv()
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')

# Get all users from the database
@router.get('/user')
async def all_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()

    return users

# Add users to the database (User registration). CHECK HERE *****************
@router.post('/user')
async def add_user(request: schemas.Users, db: Session = Depends(get_db)):
    try:
        if request.password == request.confirm_password:
            user = models.User(id=str(uuid4()), first_name=request.first_name, last_name=request.last_name, 
                    email=request.email, password=password_hash(request.password))

            db.add(user)
            db.commit()
            db.refresh(user)
            db.close()
        else:
            return {"error": "Confirm password does not match!"}
            # raise HTTPException(
            #     status_code=status.HTTP_400_BAD_REQUEST,
            #     detail="Confirm password does not match!"
            # )
    # ************************ CHECK HERE **********************************
    except (Exception, exc.IntegrityError) as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with email already exist! {e}",
        )

    token_data = {
        "sub": request.email
    }
    token = jwt.encode(token_data, JWT_SECRET_KEY, algorithm=ALGORITHM)

    url = f"http://localhost:3000/auth/verify_token?token={token}"


    content = f"""
            <html>
            <body>
                <b>Hi {user.first_name}</b></br>
                <p>
                    Welcome to <b>DropSwift</b>, thanks for being part 
                    of the community 🥰.
                </p>
                <p>
                    Now that you're registered, the next thing is to verify your 
                    email address for you to have access to the system.
                </p>
                <p>
                    Click <a href="{url}">here</a> to verify your account, or follow this link {url}
                </p>
        
            </body>
            </html>
        """

    await send_mail(email=request.email, content=content)

    return {
        "user": user,
        "message": "Success! Please check your email to confirm your account."
    }

# Get a specific user from the database
@router.get('/user/{id}')
async def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()

    # Raise an exception if user with enetered id does not exist
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                detail=f"User with id {id} not found")

    return user
