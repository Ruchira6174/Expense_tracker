from fastapi import APIRouter

# Initialize the APIRouter
# We assign a prefix so all routes in this file automatically start with /expenses
# and a tag to group them nicely in the automatically generated Swagger UI documentation.
expense_router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)

@expense_router.get("/")
def get_expenses():
    """
    Placeholder endpoint to return a list of expenses.
    """
    return {"message": "This endpoint will return expenses"}
