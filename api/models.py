from sqlalchemy import Column ,String, Integer, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from .database import Base

# This model stores users info
class User(Base):
    __tablename__ = "User"

    id = Column(String(80), primary_key=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(50), unique=True)
    password = Column(String(50))
    is_verified = Column(Boolean, default=False)

    orders = relationship("Orders", back_populates="user_id")
    cart = relationship("Cart", back_populates="product")
    details = relationship("UserDetails", back_populates="user")

class UserDetails(Base):
    __tablename__ = "UserDetails"

    user_id = Column(String(80), ForeignKey('User.id'), primary_key=True)
    phone = Column(String(20))
    address_one = Column(String(2000))
    address_two = Column(String(2000))
    city = Column(String(2000))
    postal_code = Column(String(2000))
    created_at = Column(DateTime(timezone=True))
    updated_at = Column(DateTime(timezone=True))

    user = relationship("User", back_populates="details")


class Orders(Base):
    __tablename__ = "Orders"

    order_id = Column(String(80), primary_key=True, index=True)
    customer_id = Column(String(80), ForeignKey('User.id'))
    product_id = Column(String(80), ForeignKey('Products.product_id'))
    no_of_orders = Column(Integer)
    order_status = Column(String(50))

    user_id = relationship("User", back_populates="orders")
    product = relationship("Products", back_populates="orders")

class Products(Base):
    __tablename__ = "Products"

    product_id = Column(String(80), primary_key=True, index=True)
    product_name = Column(String(200))
    description = Column(String(2000))
    price = Column(String(50))
    rating = Column(Integer)
    category = Column(String(80), ForeignKey('ProductCategory.category_id'))
    main_image_url = Column(String(300))
    image_one_url = Column(String(300))
    image_two_url = Column(String(300))
    image_three_url = Column(String(300))

    orders = relationship("Orders", back_populates="product")
    cat_value = relationship("ProductCategory", back_populates="cat")

class ProductCategory(Base):
    __tablename__ = "ProductCategory"

    category_id = Column(String(80), primary_key=True, index=True)
    name = Column(String(100))
    description = Column(String(1000))
    created_at = Column(DateTime(timezone=True))
    updated_at = Column(DateTime(timezone=True))

    cat = relationship("Products", back_populates="cat_value")

class Cart(Base):
    __tablename__ = "Cart"

    customer_id = Column(String(80), ForeignKey('User.id'))
    product_id = Column(String(80), ForeignKey('Products.product_id'), primary_key=True)

    product = relationship("User", back_populates="cart")

# Password reset model
class PasswordReset(Base):
    __tablename__ = "PasswordReset"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(50))
    code = Column(String(80))
    date_created = Column(DateTime(timezone=True))