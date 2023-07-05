from fastapi import APIRouter, HTTPException, status, Depends
from api.routers.auth import get_current_user, get_current_admin
from sqlalchemy.orm import Session
from api.database import get_db
from api import models, schemas
from uuid import uuid4
from datetime import datetime

router = APIRouter(tags=['Category (Admin)'])

unauthorized = HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"You're not authorized to perform this action!"
            )

# Get all categories from the database
@router.get('/category')
async def all_categories(db: Session = Depends(get_db)):

    try:
        categories = db.query(models.ProductCategory).all()

        return categories
    except Exception as e:
        return f"The exception: {e}"

# Add a category to the database
@router.post('/category')
async def add_category(request: schemas.Category, db: Session = Depends(get_db),
                       user: schemas.Users = Depends(get_current_admin)):

    if user.is_admin == False:
        raise unauthorized

    try:
        category = models.ProductCategory(category_id=str(uuid4()), name=request.name,
                                        description=request.description, created_at=datetime.utcnow(),
                                        updated_at=datetime.utcnow())
        db.add(category)
        db.commit()
        db.refresh(category)
        db.close()

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Couldn't add category. Please try again!",
        )
    return "Successful!"

# Remove a category from the database
@router.delete('/category/{category_id}')
async def delete_category(category_id: int, db: Session = Depends(get_db),
                          user: schemas.Users = Depends(get_current_admin)):

    if user.is_admin == False:
        raise unauthorized

    category = db.query(models.ProductCategory).filter(
        models.ProductCategory.category_id == category_id).first()
    
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                detail=f"Category with id {category_id} not found!")
    
    db.delete(category)
    db.commit()
    db.refresh(category)
    db.close()

    return HTTPException(status_code=status.HTTP_200_OK,
                         detail=f"Category with id '{category_id}' has been deleted")