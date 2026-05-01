import json
import os
print("Current working directory:", os.getcwd())

RESTAURANT_NAME = "Hungry Hare"

menu = {
    "sku1": {"name": "Hamburger", "price": 6.51},
    "sku2": {"name": "Cheeseburger", "price": 7.75},
    "sku3": {"name": "Milkshake", "price": 5.99},
    "sku4": {"name": "Fries", "price": 2.39},
    "sku5": {"name": "Sub", "price": 5.87},
    "sku6": {"name": "Ice Cream", "price": 1.55},
    "sku7": {"name": "Fountain Drink", "price": 3.45},
    "sku8": {"name": "Cookie", "price": 3.15},
    "sku9": {"name": "Brownie", "price": 2.46},
    "sku10": {"name": "Sauce", "price": 0.75}
}

app_actions = {
    "1" : "Add to the cart",
    "2" : "Remove from the cart",
    "3" : "Modify the cart",
    "4" : "View the cart",
    "5" : "Checkout",
    "6" : "Exit"
}

SALES_TAX_RATE = 0.07
cart = {}

def display_the_menu():
    print(f"\n ---MENU---")
    
    for sku in menu:
        number = sku[3:]
        item = menu[sku]["name"]
        price = menu[sku]["price"]
        
        print(f" {number} {item} = ${price}")
    print()

def add_to_cart(sku, quantity=1):
    print("DEBUG:", sku, quantity)

    if sku in menu:
        if sku in cart:
            cart[sku] += quantity
        else:
            cart[sku] = quantity   # ✅ THIS LINE WAS MISSING

        print(f"Added {quantity} x {menu[sku]['name']} to the cart")
        print("CART NOW:", cart)   # debug
    else:
        print("Invalid SKU")
        
def remove_from_cart(sku):
    if sku in cart:
        print(f" Removed {menu[sku]["name"]} from the cart")
        cart.pop(sku)
    else:
        print(f" No item in the cart")

def modify_the_cart(sku,quantity):
    if sku in cart:
        if quantity > 0:
            cart[sku] = quantity
            print(f"Updated {menu[sku["name"]]} to {quantity}")
            
        else:
            remove_from_cart(sku)
    else:
        print("No item in the cart") 
        
def view_cart():
    print(f"\n ---your cart---")
    
    if not cart:
        print("Your cart is empty\n")
        return
    
    subtotal = 0
    
    for sku in cart:
        quantity = cart[sku]
        name = menu[sku]["name"]
        price = menu[sku]["price"]
        item_total = price * quantity
        subtotal += item_total
        
        print(f"{quantity} *{price} = ${round(item_total,2)}")
        
    tax = subtotal * SALES_TAX_RATE
    total = subtotal+ tax
    
    print(f"\nsubtotal: ${round(subtotal,2)}")
    print(f"Tax : ${round(tax,2)}")
    print(f"Total: ${round(total,2)}")

def save_order(cart, total):

    order = {
        "items": cart,
        "total": total
    }

    if not os.path.exists("data"):
        os.makedirs("data")

    file_path = "data/orders.json"

    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            data = json.load(f)
    else:
        data = []

    data.append(order)

    with open(file_path, "w") as f:
        json.dump(data, f, indent=4)


def checkout():
    print("\n---- CHECKOUT ----")

    if not cart:
        print("Cart is empty.\n")
        return

    subtotal = 0

    for sku in cart:
        quantity = cart[sku]
        price = menu[sku]["price"]
        subtotal += price * quantity

    tax = subtotal * SALES_TAX_RATE
    total = subtotal + tax

    view_cart()

    save_order(cart, total)

    print("Order saved successfully!")
    print("Thank you for your order!\n")
    
def get_sku_and_quantity():
    sku_input = input("Enter SKU number: ")
    sku = "sku" + sku_input   # IMPORTANT

    quantity_input = input("Enter quantity (default 1): ")

    if quantity_input.isdigit():
        quantity = int(quantity_input)
    else:
        quantity = 1

    return sku, quantity

def order_loop():
    print(f"Welcome to {RESTAURANT_NAME}!")

    while True:
        print("\n---- OPTIONS ----")
        for key in app_actions:
            print(f"({key}) {app_actions[key]}")

        choice = input("Choose an option: ")

        if choice == "1":
            display_the_menu()
            sku, quantity = get_sku_and_quantity()
            add_to_cart(sku, quantity)

        elif choice == "2":
            display_the_menu()
            sku = "sku" + input("Enter SKU to remove: ")
            remove_from_cart(sku)

        elif choice == "3":
            display_the_menu()
            sku, quantity = get_sku_and_quantity()
            modify_the_cart(sku, quantity)

        elif choice == "4":
            view_cart()

        elif choice == "5":
            checkout()
            break

        elif choice == "6":
            print("Goodbye!")
            break

        else:
            print("Invalid option. Try again.")


# -------- RUN APP --------
order_loop()                