import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

BACKEND_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_DIR / ".env")

# Retrieve database connection credentials from environment variables
# Fallback to empty string or default values if the variable is not found
DB_USER = os.getenv("MYSQL_USER", "root")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "")
DB_HOST = os.getenv("MYSQL_HOST", "localhost")
DB_PORT = os.getenv("MYSQL_PORT", "3306")
DB_NAME = os.getenv("MYSQL_DATABASE", "expense_tracker")

# Construct the SQLAlchemy database URL for MySQL
# Format: mysql+pymysql://<username>:<password>@<host>:<port>/<database_name>
# We use pymysql as the driver for MySQL connection
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create the SQLAlchemy engine
# The engine is the starting point for any SQLAlchemy application,
# and it represents the interface to the database.
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)

# Create a SessionLocal class
# Each instance of the SessionLocal class will be a database session.
# We disable autocommit and autoflush so we can manage transactions manually.
# We bind the session to our engine.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a Base class
# All of our SQLAlchemy ORM models will inherit from this Base class.
# It maintains a catalog of classes and tables relative to that base.
Base = declarative_base()

# Dependency function to get the database session
# This is often used in FastAPI routes to inject the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
