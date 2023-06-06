from fastapi import APIRouter, HTTPException, status, Depends
from api.routers.auth import get_current_admin
from sqlalchemy.orm import Session
from api.database import get_db
from api import models, schemas
from datetime import datetime
from uuid import uuid4

router = APIRouter(tags=['Products'])

unauthorized = HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"You're not authorized to perform this action!"
            )

# Get all products from the database
@router.get('/products')
async def all_products(name: str = None, price: str = None, category: str = None,
                       rating: int = None, newest: bool = None, db: Session = Depends(get_db)):

    filters = []
    if name:
        filters.append(models.Products.product_name == name)
    if category:
        filters.append(models.Products.category == category)
    if rating:
        filters.append(models.Products.rating == rating)

    query = db.query(models.Products)

    if price:
        if price == "lowest":
            query = query.order_by(models.Products.price.asc())
        elif price == "highest":
            query = query.order_by(models.Products.price.desc())
    if newest == True:
        query = query.order_by(models.Products.date_added.desc()).all()

    products = query.filter(*filters).all()

    return products

# Add a product to the database (Admin)
@router.post('/product')
async def admin_add_product(request: schemas.Products, db: Session = Depends(get_db),
    user: schemas.Users = Depends(get_current_admin)):

    if user.is_admin == False:
        raise unauthorized

    category = db.query(models.ProductCategory).filter(models.ProductCategory.name == request.category).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product category '{request.category}' not found. Please use a valid category or add this new category to record."
            )
    
    try:
        product = models.Products(product_id=str(uuid4()), product_name=request.product_name,
                    description=request.description, price=request.price, rating=request.rating,
                    category=request.category, main_image_url=request.main_image_url, image_one_url=request.image_one_url,
                    image_two_url=request.image_two_url, image_three_url=request.image_three_url,
                    date_added=datetime.utcnow())
        
        db.add(product)
        db.commit()
        db.refresh(product)
        db.close()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Couldn't add product. Please try again!",
        )
    
    return {"product": product, "message": "Product successfully added!"}

# Get a specific product from the database
@router.get('/product/{id}')
async def get_product(id: str, db: Session = Depends(get_db)):

    product = db.query(models.Products).filter(models.Products.product_id == id).first()

    # Raise an exception if user with enetered id does not exist
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, 
                detail=f"Product with id {id} not found")

    return product

# Delete product from database (Admin)
@router.delete('/product')
async def admin_delete_product(product_id: str, db: Session = Depends(get_db),
    user: schemas.Users = Depends(get_current_admin)):

    if user.is_admin == False:
        raise unauthorized
    
    product = db.query(models.Products).filter(
        models.Products.product_id == product_id
    ).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id {product_id} not found!!!"
        )
    
    db.delete(product)
    db.commit()
    db.close()

    raise HTTPException(
        status_code=status.HTTP_200_OK,
        detail="Product has been successfully deleted!"
    )
