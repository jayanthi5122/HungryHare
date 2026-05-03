import os
print("RUNNING FROM:", os.getcwd())

from flask import Flask, render_template, request, jsonify
import sqlite3
import json


base_dir = os.path.abspath(os.path.dirname(__file__))

app = Flask(
    __name__,
    template_folder=os.path.join(base_dir, "templates"),
    static_folder=os.path.join(base_dir, "static")
)
# Home route
@app.route("/")
def home():
    return render_template("index.html")

# Save order
@app.route("/checkout", methods=["POST"])
def checkout():
    data = request.json

    user = data["user"]
    cart = data["cart"]
    total = data["total"]

    conn = sqlite3.connect("food_order.db")
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO orders (user_name, items, total)
        VALUES (?, ?, ?)
    """, (user, json.dumps(cart), total))

    conn.commit()
    conn.close()

    return jsonify({"message": "Order saved!"})

# Get order history
@app.route("/orders/<user>")
def get_orders(user):
    conn = sqlite3.connect("food_order.db")
    cursor = conn.cursor()

    cursor.execute("SELECT items, total FROM orders WHERE user_name = ?", (user,))
    rows = cursor.fetchall()

    conn.close()

    return jsonify(rows)

if __name__ == "__main__":
    app.run(debug=True)