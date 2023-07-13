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

    orders = relationship("Orders", back_populates="user")
    cart = relationship("Cart", back_populates="user")
    details = relationship("UserDetails", back_populates="user")

class Admin(Base):
    __tablename__ = "Admin"

    id = Column(String(80), primary_key=True, index=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(50), unique=True)
    password = Column(String(50))
    is_admin = Column(Boolean, default=False)

class UserDetails(Base):
    __tablename__ = "UserDetails"

    user_id = Column(String(80), ForeignKey('User.id'), primary_key=True)
    phone = Column(String(20))
    address_one = Column(String(2000))
    address_two = Column(String(2000))
    city = Column(String(2000))
    postal_code = Column(Integer)
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
    date_added = Column(DateTime(timezone=True))

    user = relationship("User", back_populates="orders")
    product = relationship("Products", back_populates="orders")

class Products(Base):
    __tablename__ = "Products"

    product_id = Column(String(80), primary_key=True, index=True)
    product_name = Column(String(200))
    description = Column(String(2000))
    tag = Column(String(200))
    price = Column(Integer)
    rating = Column(Integer)
    category = Column(String(80), ForeignKey('ProductCategory.name'))
    main_image_url = Column(String(300))
    image_one_url = Column(String(300))
    image_two_url = Column(String(300))
    image_three_url = Column(String(300))
    date_added = Column(DateTime(timezone=True))

    orders = relationship("Orders", back_populates="product")
    cat_value = relationship("ProductCategory", back_populates="products")

class ProductCategory(Base):
    __tablename__ = "ProductCategory"

    category_id = Column(String(80), primary_key=True, index=True)
    name = Column(String(100), unique=True)
    description = Column(String(1000))
    created_at = Column(DateTime(timezone=True))
    updated_at = Column(DateTime(timezone=True))

    products = relationship("Products", back_populates="cat_value")

class Cart(Base):
    __tablename__ = "Cart"

    cart_id = Column(String(80), primary_key=True, index=True)
    customer_id = Column(String(80), ForeignKey('User.id'))
    product_id = Column(String(80), ForeignKey('Products.product_id'))

    user = relationship("User", back_populates="cart")
    product = relationship("Products")

# Password reset model
class PasswordReset(Base):
    __tablename__ = "PasswordReset"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(50))
    code = Column(String(80))
    date_created = Column(DateTime(timezone=True))