from contextlib import asynccontextmanager
from fastapi import FastAPI

# Import database configuration and models
from app.database.database import Base, engine
from app.models.expense import Expense

# Import the APIRouter from your routes directory
from app.routes.expenses import expense_router

# The lifespan context manager is the recommended way in modern FastAPI
# to execute code on application startup and shutdown.
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- STARTUP LOGIC ---
    print("Creating database tables on startup...")
    # This safely creates tables for all models inheriting from Base
    # if they do not already exist in the database.
    Base.metadata.create_all(bind=engine)
    
    yield # The application runs during this yield
    
    # --- SHUTDOWN LOGIC ---
    print("Application shutting down...")

# Create the FastAPI app instance, attaching the lifespan manager
app = FastAPI(
    title="Expense Tracker",
    lifespan=lifespan
)

# Register the APIRouter with the main application
# This connects all routes defined in `expense_router` to this app
app.include_router(expense_router)

@app.get("/")
def read_root():
    return {"message": "Expense Tracker API is running"}
