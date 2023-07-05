from fastapi import APIRouter, HTTPException, status, Depends
from api.routers.auth import get_current_user
from sqlalchemy.orm import Session
from api.database import get_db
from api import models, schemas
from uuid import uuid4

router = APIRouter(tags=['Cart'])

# Add product to cart
@router.post('/add-to-cart')
async def add_to_cart(request: schemas.Cart, db: Session = Depends(get_db),
    user: schemas.Users = Depends(get_current_user)):

    product = db.query(models.Products).filter(models.Products.product_id == request.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id '{request.product_id}' does not exist!!!"
        )

    cart_item = db.query(models.Cart).filter(
        models.Cart.customer_id == user.id,
        models.Cart.product_id == request.product_id
        ).first()
    
    if cart_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product already exist in your cart!"
        )  
    
    try:
        cart =  models.Cart(user=user, cart_id=str(uuid4()), product=product)
        db.add(cart)
        db.commit()
        db.refresh(cart)
        db.close()
    except Exception as e:
        return f"Exception: {e}"
    
    # return {"cart": cart, "product": cart.product, "user": cart.user}
    return {"message": "Successfully added to cart!"}

# Delete product from cart
@router.post('/delete-from-cart')
async def remove_product_from_cart(request: schemas.Cart, db: Session = Depends(get_db),
    user: schemas.Users = Depends(get_current_user)):

    product = db.query(models.Products).filter(models.Products.product_id == request.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id '{request.product_id}' does not exist!!!"
        )
    
    cart_item = db.query(models.Cart).filter(
        models.Cart.customer_id == user.id,
        models.Cart.product_id == request.product_id
        ).first()
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You do not have this product in your cart!"
        )
    db.delete(cart_item)
    db.commit()

    return HTTPException(
        status_code=status.HTTP_200_OK,
        detail="Product sucessfully deleted from your cart!"
    )
