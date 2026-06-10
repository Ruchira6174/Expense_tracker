import pymysql

try:
    connection = pymysql.connect(
        host="localhost",
        user="root",
        password="Ruchira",
        database="expense_tracker"
    )

    print("Connected Successfully!")
    connection.close()

except Exception as e:
    print("Error:", e)