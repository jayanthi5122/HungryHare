import sqlite3

conn = sqlite3.connect("food_order.db")
cursor = conn.cursor()

cursor.execute("SELECT * FROM users")
rows = cursor.fetchall()

print("USERS:")
for row in rows:
    print(row)

conn.close()