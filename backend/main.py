from contextlib import asynccontextmanager
from fastapi import FastAPI

# Import database configuration and models
from app.database.database import Base, engine
from app.models.expense import Expense
from app.models.income import Income

# Import routers from the routes directory
from app.routes.expenses import expense_router
from app.routes.income import income_router
from app.routes.summary import summary_router

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

# Register APIRouters with the main application
app.include_router(expense_router)
app.include_router(income_router)
app.include_router(summary_router)

@app.get("/")
def read_root():
    return {"message": "Expense Tracker API is running"}
