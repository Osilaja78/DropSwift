from fastapi import APIRouter, HTTPException, status, Depends
from api.routers.auth import get_current_user, get_current_admin
from sqlalchemy.orm import Session
from api.database import get_db
from api import models, schemas
from sqlalchemy.orm import joinedload
from uuid import uuid4

router = APIRouter(tags=['Orders'])

unauthorized = HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"You're not authorized to perform this action!"
            )

# Get all orders (Admin)
@router.get('/order')
async def admin_get_all_orders(status: str = None, db: Session = Depends(get_db),
                         user: schemas.Users = Depends(get_current_admin)):

    if user.is_admin == False:
        raise unauthorized
    filters = []
    if status:
        filters.append(models.Orders.order_status == status)

    orders = db.query(models.Orders).filter(*filters).options(
        joinedload(models.Orders.user)
    ).all()
    return orders

# Add product to orders
@router.post('/order')
async def add_an_order(request: schemas.Order, db: Session = Depends(get_db),
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
    in_cart = db.query(models.Cart).filter(
        models.Cart.customer_id == user.id,
        models.Cart.product_id == request.product_id
    ).first()
    if in_cart:
        db.delete(in_cart)
        db.commit()
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
@router.get('/user-orders')
async def get_user_orders(status: str = None, db: Session = Depends(get_db),
    user: schemas.Users = Depends(get_current_user)):

    filters = [models.Orders.customer_id == user.id]
    if status:
            filters.append(models.Orders.order_status == status)

    try:
        orders = db.query(models.Orders).filter(
            *filters
        ).options(
            joinedload(models.Orders.product)
        ).all()
    except Exception as e:
        return f"Exception: {e}"
    
    return orders

# Cancel an order
@router.put('/cancel-order')
async def cancel_an_order(product_id: str, db: Session = Depends(get_db),
    user: schemas.Users = Depends(get_current_user)):

    product = db.query(models.Products).filter(models.Products.product_id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with id '{product_id}' does not exist!!!"
        )
    
    order_item = db.query(models.Orders).filter(
        models.Orders.customer_id == user.id,
        models.Orders.product_id == product_id
        ).first()
    
    if not order_item:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product does not exist in your orders!"
        )
    
    try:
        if order_item.order_status == "Shipped":
            return {"message": "Order can no longer be cancelled!"}
        elif order_item.order_status == "Delivered":
            return {"message": "Order has been delivered already!"}
        elif order_item.order_status == "Cancelled":
            return {"message": "Order has already been cancelled!"}

        order_item.order_status = "Cancelled"
        db.commit()
    except Exception as e:
        return f"Exception: {e}"
    
    return {"message": "Order has been successfully cancelled!"}

# Confirm an order and change order status (Admin)
@router.put('/change-order-status')
async def admin_cahange_order_status(order_id: str, order_status: str, db: Session = Depends(get_db),
                         user: schemas.Users = Depends(get_current_admin)):
    
    if user.is_admin == False:
        raise unauthorized
    
    order = db.query(models.Orders).filter(
        models.Orders.order_id == order_id
    ).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with id {order_id} not found!!!"
        )
    order.order_status = order_status
    db.commit()
    db.close()

    raise HTTPException(
        status_code=status.HTTP_200_OK,
        detail=f"Order status has been successfully changed to '{order_status}'"
    )