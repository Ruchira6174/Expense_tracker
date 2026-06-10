from typing import List, Dict, Any

def calculate_total_expenses(expenses: List[Dict[str, Any]]) -> float:
    """
    Calculate the total sum of all expenses.
    
    Args:
        expenses: A list of expense dictionaries containing at least an 'amount'.
        
    Returns:
        float: The total amount spent. Returns 0.0 if the list is empty.
    """
    if not expenses:
        return 0.0
        
    return sum(float(expense.get("amount", 0.0)) for expense in expenses)


def calculate_category_wise_expenses(expenses: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Calculate the total amount spent grouped by category.
    
    Args:
        expenses: A list of expense dictionaries containing 'amount' and 'category'.
        
    Returns:
        Dict[str, float]: A dictionary with categories as keys and total amounts as values.
    """
    category_totals: Dict[str, float] = {}
    
    if not expenses:
        return category_totals
        
    for expense in expenses:
        category = str(expense.get("category", "Uncategorized"))
        amount = float(expense.get("amount", 0.0))
        
        category_totals[category] = category_totals.get(category, 0.0) + amount
            
    return category_totals


def calculate_monthly_expenses(expenses: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Calculate the total expenses grouped by month.
    
    Args:
        expenses: A list of expense dictionaries containing 'amount' and 'date' (YYYY-MM-DD).
        
    Returns:
        Dict[str, float]: A dictionary with months (YYYY-MM) as keys and total amounts as values.
    """
    monthly_totals: Dict[str, float] = {}
    
    if not expenses:
        return monthly_totals
        
    for expense in expenses:
        date_str = str(expense.get("date", ""))
        amount = float(expense.get("amount", 0.0))
        
        # Extract YYYY-MM from YYYY-MM-DD
        if len(date_str) >= 7:
            month = date_str[:7]
            monthly_totals[month] = monthly_totals.get(month, 0.0) + amount
                
    return monthly_totals


def calculate_average_expense(expenses: List[Dict[str, Any]]) -> float:
    """
    Calculate the average amount of a single expense.
    
    Args:
        expenses: A list of expense dictionaries containing 'amount'.
        
    Returns:
        float: The average expense amount. Returns 0.0 if the list is empty.
    """
    if not expenses:
        return 0.0
        
    total = calculate_total_expenses(expenses)
    return float(total / len(expenses))
