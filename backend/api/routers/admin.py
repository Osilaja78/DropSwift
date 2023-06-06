from fastapi import APIRouter, HTTPException, status, Depends
from api.routers.auth import get_current_admin
from sqlalchemy.orm import Session
from api.database import get_db
from api import models, schemas
from api.utils.hashing import password_hash
from api.utils.email import send_mail
from uuid import uuid4

router = APIRouter(tags=['Admin'])

# Get all admin from the database
@router.get('/admin')
async def all_admin(is_admin: str = None, db: Session = Depends(get_db),
                     user: schemas.Users = Depends(get_current_admin)):

    filters = []
    if is_admin:
        filters.append(models.Admin.is_admin == is_admin)

    admins = db.query(models.Admin).filter(*filters).all()

    return admins

# Register an admin
@router.post('/admin')
async def register_an_admin(request: schemas.Admin, db: Session = Depends(get_db)):
    
    try:
        if request.password == request.confirm_password:
            admin = models.Admin(
                id=str(uuid4()), first_name=request.first_name, last_name=request.last_name, 
                email=request.email, password=password_hash(request.password)
                )

            db.add(admin)
            db.commit()
            db.refresh(admin)
            db.close()
        else:
            return {"message": "Confirm password does not match!"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with email already exist! {e}",
        )
    
    content = f"""
            <html>
            <body>
                <b>Hi Admin {admin.first_name}</b></br>
                <p>
                    Welcome to <b>DropSwift</b> ADMIN PLATFORM, thanks for being part 
                    of the community 🥰.
                </p>
                <p>
                    Now that you're registered, the next thing is to wait for your account
                    to get verified. You'll recieve an email once this is done.
                    </br>
                    </br>
                    <b>Thanks for your patience.</b>
                </p>
            </body>
            </html>
        """
    # ************ UNCOMMENT BELOW AFTER TESTING *************8
    # await send_mail(email=request.email, content=content)

    return {
        "user": admin,
        "message": "Success! Please check your email."
    }

# Confirm an admin
@router.put('/admin-action')
async def confirm_or_delete_an_admin(email: str, action: str, db: Session = Depends(get_db),
                           user: schemas.Users = Depends(get_current_admin)):
    
    unauthorized = HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"You're not authorized to perform this action!"
            )
    try:
        if action == "Confirm":
            if user.is_admin and user.is_admin == True:
                admin = db.query(models.Admin).filter(
                    models.Admin.email == email
                ).first()
                if not admin:
                    return {"message": f"Admin with email '{email}' does not exist!"}
                if admin.is_admin == True:
                    return {"message": f"Admin with email '{email}' was already verified!!!"}
                else:
                    admin.is_admin = True
                    db.commit()
                return {"message": f"Admin with email '{email}' has been successfully verified!"}
            else:
                raise unauthorized
        elif action == "Delete":
            if user.is_admin and user.is_admin == True:
                admin = db.query(models.Admin).filter(
                    models.Admin.email == email
                ).first()
                if not admin:
                    return {"message": f"Admin with email '{email}' does not exist!"}
                db.delete(admin)
                db.commit()
                return {"message": f"Admin with email '{email}' has been successfully deleted!"}
        else:
            return {"message": "Action can either be 'Confirm' or 'Delete'!"}
    except Exception as e:
        raise unauthorized

    