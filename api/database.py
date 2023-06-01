from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv, dotenv_values
import os

load_dotenv()


DATABASE_NAME = os.getenv('DATABASE_NAME')
DATABASE_HOST = os.getenv('DATABASE_HOST')
DATABASE_PORT = os.getenv('DATABASE_PORT')
DATABASE_USER = os.getenv('DATABASE_USER')
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD')

# SQLALCHEMY_DATABASE_URL = f"mysql+mysqlconnector://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"
# URL for sqlite database
SQLALCHEMY_DATABASE_URL = "sqlite:///./DropSwift.db"

# Create SQLAlcheny engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    # pool_size=1000, max_overflow=0
    # connect_args={"check_same_thread": False}
)

#  Create a sessionLocal class
sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#  Creata a base class
Base = declarative_base()

def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()