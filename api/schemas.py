from pydantic import BaseModel, EmailStr

class Users(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    confirm_password: str

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

class Category(BaseModel):
    name: str
    description: str

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