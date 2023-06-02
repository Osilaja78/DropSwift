from fastapi import APIRouter, HTTPException, status, Depends
from api.routers.auth import get_current_user
from sqlalchemy.orm import Session
from api.database import get_db
from api import models, schemas
from uuid import uuid4

router = APIRouter(tags=['Products'])

# Get all products from the database
@router.get('/products')
async def all_products(db: Session = Depends(get_db)):
    products = db.query(models.Products).all()

    return products

@router.post('/product')
async def add_product(request: schemas.Products, db: Session = Depends(get_db),
    user: schemas.Users = Depends(get_current_user)):

    category = db.query(models.ProductCategory).filter(models.ProductCategory.name == request.category).first()

    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product category '{request.category}' not found. Please use a valid category or add this new category to record.")
    
    cat_id = category.category_id
    print(cat_id)
    
    try:
        product = models.Products(product_id=str(uuid4()), product_name=request.product_name,
                    description=request.description, price=request.price, rating=request.rating,
                    category=request.category, main_image_url=request.main_image_url, image_one_url=request.image_one_url,
                    image_two_url=request.image_two_url, image_three_url=request.image_three_url)
        
        db.add(product)
        db.commit()
        db.refresh(product)
        db.close()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Couldn't add product. Please try again!",
        )
    
    return product

# Get a specific product from the database
@router.get('/product/{id}')
async def get_product(id: str, db: Session = Depends(get_db)):

    product = db.query(models.Products).filter(models.Products.product_id == id).first()

    # Raise an exception if user with enetered id does not exist
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                detail=f"Product with id {id} not found")

    return product