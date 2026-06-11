import csv
import io
from collections import defaultdict
from datetime import date, datetime
from typing import Iterable, List

from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.models.income import Income


def _format_date(value):
    if isinstance(value, (date, datetime)):
        return value.isoformat()
    return value or ""


def _format_amount(value):
    return f"{float(value or 0):.2f}"


def build_expenses_csv(db: Session, user_id: int) -> str:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Date", "Title", "Category", "Amount", "Notes"])

    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == user_id)
        .order_by(Expense.date.desc(), Expense.id.desc())
        .all()
    )
    for expense in expenses:
        writer.writerow([
            expense.id,
            _format_date(expense.date),
            expense.title,
            expense.category,
            _format_amount(expense.amount),
            expense.notes or "",
        ])

    return output.getvalue()


def build_income_csv(db: Session, user_id: int) -> str:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Date", "Source", "Amount", "Description"])

    incomes = (
        db.query(Income)
        .filter(Income.user_id == user_id)
        .order_by(Income.date.desc(), Income.id.desc())
        .all()
    )
    for income in incomes:
        writer.writerow([
            income.id,
            _format_date(income.date),
            income.source,
            _format_amount(income.amount),
            income.description or "",
        ])

    return output.getvalue()


def build_monthly_report_lines(db: Session, user_id: int) -> List[str]:
    monthly = defaultdict(lambda: {"income": 0.0, "expenses": 0.0})

    incomes = db.query(Income).filter(Income.user_id == user_id).all()
    expenses = db.query(Expense).filter(Expense.user_id == user_id).all()

    for income in incomes:
        month_key = income.date.strftime("%Y-%m")
        monthly[month_key]["income"] += float(income.amount or 0)

    for expense in expenses:
        month_key = expense.date.strftime("%Y-%m")
        monthly[month_key]["expenses"] += float(expense.amount or 0)

    lines = [
        "Monthly Financial Report",
        f"Generated: {date.today().isoformat()}",
        "",
        "Month        Income        Expenses      Balance",
        "------------------------------------------------",
    ]

    if not monthly:
        lines.append("No income or expense records found.")
        return lines

    for month_key in sorted(monthly.keys(), reverse=True):
        income = monthly[month_key]["income"]
        expenses = monthly[month_key]["expenses"]
        balance = income - expenses
        lines.append(
            f"{month_key:<12} ${income:>10.2f}  ${expenses:>10.2f}  ${balance:>10.2f}"
        )

    return lines


def _escape_pdf_text(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def build_simple_pdf(lines: Iterable[str]) -> bytes:
    text_commands = ["BT", "/F1 12 Tf", "72 760 Td", "14 TL"]
    for index, line in enumerate(lines):
        escaped = _escape_pdf_text(str(line))
        if index == 0:
            text_commands.append(f"({escaped}) Tj")
        else:
            text_commands.append(f"T* ({escaped}) Tj")
    text_commands.append("ET")

    stream = "\n".join(text_commands).encode("latin-1", errors="replace")
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
        b"/Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        b"<< /Length " + str(len(stream)).encode("ascii") + b" >>\nstream\n" + stream + b"\nendstream",
    ]

    pdf = io.BytesIO()
    pdf.write(b"%PDF-1.4\n")
    offsets = [0]
    for number, body in enumerate(objects, start=1):
        offsets.append(pdf.tell())
        pdf.write(f"{number} 0 obj\n".encode("ascii"))
        pdf.write(body)
        pdf.write(b"\nendobj\n")

    xref_start = pdf.tell()
    pdf.write(f"xref\n0 {len(objects) + 1}\n".encode("ascii"))
    pdf.write(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        pdf.write(f"{offset:010d} 00000 n \n".encode("ascii"))

    pdf.write(
        f"trailer << /Size {len(objects) + 1} /Root 1 0 R >>\n"
        f"startxref\n{xref_start}\n%%EOF\n".encode("ascii")
    )
    return pdf.getvalue()
