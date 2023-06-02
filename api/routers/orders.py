from fastapi import APIRouter, HTTPException, status, Depends
from api.routers.auth import get_current_user
from sqlalchemy.orm import Session
from api.database import get_db
from api import models, schemas
from uuid import uuid4

router = APIRouter(tags=['Orders'])

# Add product to orders
@router.post('/order')
async def add_to_cart(request: schemas.Order, db: Session = Depends(get_db),
    user: schemas.Users = Depends(get_current_user)):

    product = db.query(models.Products).filter(models.Products.product_id == request.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id '{request.product_id}' does not exist!!!"
        )
    
    order_item = db.query(models.Orders).filter(
        models.Orders.customer_id == user.id,
        models.Orders.product_id == request.product_id
        ).first()
    
    if order_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product already exist in your orders!"
        )
    
    try:
        order =  models.Orders(
            user=user, order_id=str(uuid4()), no_of_orders=request.no_of_order,
            order_status="Pending", product=product
            )
        
        db.add(order)
        db.commit()
        db.refresh(order)
        db.close()
    except Exception as e:
        return f"Exception: {e}"
    
    return {"messge": "Your order has been successfully submitted. Please check your email for order details!"}

# Get all orders belonging to a user
@router.get('/orders')
async def get_user_orders(request: schemas.Order, db: Session = Depends(get_db),
    user: schemas.Users = Depends(get_current_user)):

    try:
        orders = db.query(models.Orders).filter(
            models.Orders.customer_id == user.id,
        ).all()

        # ******************* ADD FILTERS FOR PENDING, ACTIVE, CANCELLED, AND SUCCESSFUL ORDERS *********
    except Exception as e:
        return f"Exception: {e}"
    
    return orders

# Cancel an order
# Confirm an order (Admin)
# Get all active orders (Admin)
# Get all cancelled orders (Admin)