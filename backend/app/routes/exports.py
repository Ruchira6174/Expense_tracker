from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies import get_current_user_id
from app.services import export_service


export_router = APIRouter(
    prefix="/exports",
    tags=["Exports"]
)

def _download_response(content, media_type: str, filename: str) -> Response:
    return Response(
        content=content,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@export_router.get("/expenses.csv")
def export_expenses_csv(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    csv_content = export_service.build_expenses_csv(db, user_id)
    return _download_response(csv_content, "text/csv", "expenses.csv")


@export_router.get("/income.csv")
def export_income_csv(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    csv_content = export_service.build_income_csv(db, user_id)
    return _download_response(csv_content, "text/csv", "income.csv")


@export_router.get("/monthly-report.pdf")
def export_monthly_report_pdf(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    lines = export_service.build_monthly_report_lines(db, user_id)
    pdf_content = export_service.build_simple_pdf(lines)
    return _download_response(pdf_content, "application/pdf", "monthly-report.pdf")
