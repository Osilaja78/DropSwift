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
from api.routers.auth import get_current_user
from datetime import datetime
from sqlalchemy.orm import joinedload
from uuid import uuid4
import os


router = APIRouter(tags=['User'])

load_dotenv()
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')

# Get all users from the database
@router.get('/user')
async def all_users(db: Session = Depends(get_db)):
    users = db.query(models.User).options(
        joinedload(models.User.details),
        joinedload(models.User.cart),
        joinedload(models.User.orders)
        ).all()

    return users

# Add users to the database (User registration). CHECK HERE *****************
@router.post('/user')
async def add_user(request: schemas.Users, db: Session = Depends(get_db)):
    if request.password == request.confirm_password:
        try:
            user = models.User(id=str(uuid4()), first_name=request.first_name, last_name=request.last_name, 
                    email=request.email, password=password_hash(request.password))

            db.add(user)
            db.commit()
            db.refresh(user)
            db.close()
        # ************************ CHECK HERE **********************************
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"User with email already exist!",
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Confirm password does not match!"
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
async def get_user(id: str, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(models.User.id == id).options(
            joinedload(models.User.details),
            joinedload(models.User.cart),
            joinedload(models.User.orders)
        ).first()

    # Raise an exception if user with enetered id does not exist
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                detail=f"User with id {id} not found")

    return user

# Add user details to the database.
@router.post('/user-details')
async def add_user_details(request: schemas.UserDetails, db: Session = Depends(get_db),
                           user: schemas.Users = Depends(get_current_user)):
    
    user_id = db.query(models.UserDetails).filter(models.User.id == user.id).first()
    if not user_id:
        try:
            details = models.UserDetails(
                user=user, phone=request.phone, address_one=request.address_one,
                address_two=request.address_two, city=request.city, postal_code=request.postal_code,
                created_at=datetime.utcnow(), updated_at=datetime.utcnow()
            )

            db.add(details)
            db.commit()
            db.refresh(details)
            db.close()
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                    detail=f"Exception: {e}")
        return details
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                    detail=f"User details already exist!")

# Update user details in the database.
@router.put('/user-details')
async def update_user_details(phone: str = None, address_one: str = None, address_two: str = None,
                              city: str = None, postal_code: int = None, db: Session = Depends(get_db),
                           user: schemas.Users = Depends(get_current_user)):
    
    user_details =  db.query(models.UserDetails).filter(models.User.id == user.id).first()
    print(user_details.phone)
    print(user)

    if not user_details:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            details="User not found."
        )
    try:
        user=user
        if phone:
            user_details.phone = phone
        if address_one:
            user_details.address_one = address_one
        if address_two:
            user_details.address_two = address_two
        if city:
            user_details.city = city
        if postal_code:
            user_details.postal_code = postal_code
        user_details.updated_at=datetime.utcnow()

        db.commit()
        # db.close()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Exception: {e}")
    return {"message" : "User details updated successfully!"}
