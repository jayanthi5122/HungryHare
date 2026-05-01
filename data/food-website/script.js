console.log("JS is working");



const menu = [
    { name: "Hamburger", price: 6.51 },
    { name: "Cheeseburger", price: 7.75 },
    { name: "Milkshake", price: 5.99 },
    { name: "Fries", price: 2.39 },
    {name: "Sub", price: 5.87},
    {name: "Ice cream", price: 1.55},
    {name: "Fountain", price: 3.45},
    {name:"Cookies", price: 3.15},
    {name: "Brownie", price: 2.46},
    {name: "Sauce", price: 0.75}
];

let cart = [];
let currentUser = "";

// ---------- LOGIN ----------
function login() {
    let name = document.getElementById("username").value;

    if (name === "") {
        alert("Please enter name");
        return;
    }

    currentUser = name;

    localStorage.setItem("user", name);

    document.getElementById("loginSection").style.display = "none";
    document.getElementById("app").style.display = "block";

    document.getElementById("welcome").innerText = "Welcome " + name;

    displayMenu();
    loadHistory();
}

// ---------- MENU ----------
function displayMenu() {
    let menuDiv = document.getElementById("menu");

    menu.forEach((item, index) => {
        menuDiv.innerHTML += `
            <p>
                ${item.name} - $${item.price}
                <button onclick="addToCart(${index})">Add</button>
            </p>
        `;
    });
}

// ---------- CART ----------
function addToCart(index) {
    let item = menu[index];

    let existing = cart.find(c => c.name === item.name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }

    displayCart();
}

function displayCart() {
    let cartDiv = document.getElementById("cart");
    let total = 0;

    cartDiv.innerHTML = "";

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        cartDiv.innerHTML += `
            <p>
                ${item.name} x ${item.quantity} = $${itemTotal.toFixed(2)}
                
                <button onclick="updateQty(${index}, 1)">+</button>
                <button onclick="updateQty(${index}, -1)">-</button>
                <button onclick="removeItem(${index})">Remove</button>
            </p>
        `;
    });

    document.getElementById("total").innerText =
        "Total: $" + total.toFixed(2);
}

function removeItem(index) {
    cart.splice(index, 1);
    displayCart();
}

function updateQty(index, change) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    displayCart();
}

// ---------- CHECKOUT ----------
function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    let order = {
        user: currentUser,
        items: cart,
        date: new Date().toLocaleString()
    };

    orders.push(order);

    localStorage.setItem("orders", JSON.stringify(orders));

    cart = [];
    displayCart();

    loadHistory();

    alert("Order placed successfully!");
}

// ---------- ORDER HISTORY ----------
function loadHistory() {
    let historyDiv = document.getElementById("history");

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    historyDiv.innerHTML = "";

    orders.forEach(order => {
        if (order.user === currentUser) {
            historyDiv.innerHTML += `
                <p>
                    <b>${order.date}</b><br>
                    ${order.items.map(i => i.name + " x " + i.quantity).join(", ")}
                </p>
            `;
        }
    });
}