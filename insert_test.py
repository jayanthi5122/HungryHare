import sqlite3

conn = sqlite3.connect("food_order.db")
cursor = conn.cursor()

cursor.execute("INSERT INTO users (name) VALUES (?)", ("Kishore",))

conn.commit()
conn.close()

print("User inserted")