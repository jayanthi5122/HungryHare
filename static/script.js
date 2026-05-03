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
let currentUser = "Jayanthi";

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
async function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let response = await fetch("/checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user: currentUser,
            cart: cart,
            total: total
        })
    });

    let data = await response.json();

    alert(data.message);

    cart = [];
    displayCart();
}
async function viewOrders() {
    let user = currentUser;  // make sure this exists

    let response = await fetch(`/orders/${user}`);
    let data = await response.json();

    let output = "<h3>Order History</h3>";

    data.forEach(order => {
        let items = JSON.parse(order[0]);

        output += "<div style='border:1px solid #ccc; margin:10px; padding:10px;'>";

        for (let sku in items) {
            output += `<p>${sku} × ${items[sku]}</p>`;
        }

        output += `<p><strong>Total: €${order[1]}</strong></p>`;
        output += "</div>";
    });

    document.getElementById("orders").innerHTML = output;
}
<button onclick="viewOrders()">View Order History</button>

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