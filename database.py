import sqlite3

# create database file
conn = sqlite3.connect("food_order.db")

cursor = conn.cursor()

# create users table
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
)
""")

# create orders table
cursor.execute("""
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT,
    items TEXT,
    total REAL
)
""")

conn.commit()
conn.close()

print("Database created successfully")