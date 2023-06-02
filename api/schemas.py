from pydantic import BaseModel, EmailStr
from typing import List

class Users(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    confirm_password: str

    class Config():
        orm_mode = True

class UserDetails(BaseModel):
    phone: str
    address_one: str
    address_two: str
    city: str
    postal_code: int

    class Config():
        orm_mode = True

class Products(BaseModel):
    product_name: str
    description: str
    price: str
    rating: int
    category: str
    main_image_url: str
    image_one_url: str
    image_two_url: str
    image_three_url: str

    class Config():
        orm_mode = True

class Category(BaseModel):
    name: str
    description: str

    class Config():
        orm_mode = True

class Cart(BaseModel):
    product_id: str

    class Config():
        orm_mode = True

class Order(BaseModel):
    product_id: str
    no_of_order: int

class Login(BaseModel):
    email: EmailStr
    password: str

# FOR JWT AUTHENTICATION
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str

class ResetPasswordInit(BaseModel):
    email: EmailStr

class FinalizeResetPassword(BaseModel):
    new_password: str
    code: str