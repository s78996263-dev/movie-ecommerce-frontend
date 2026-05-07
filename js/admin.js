const API_URL = "http://localhost:8081";

const container = document.getElementById("productContainer");
const count = document.getElementById("count");

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "ADMIN") {
    alert("Access denied");
    window.location.href = "login.html";
}

// Load products
async function loadProducts() {
    try {
        const res = await fetch(`${API_URL}/api/products`);
        const products = await res.json();

        count.innerText = products.length;

        container.innerHTML = "";

        products.forEach(p => {
            const div = document.createElement("div");
            div.classList.add("card");

            div.innerHTML = `
                <img src="${p.image}">
                <h4>${p.name}</h4>
                <p>₹${p.price}</p>
                <button onclick="deleteProduct('${p.id}')">Delete</button>
            `;

            container.appendChild(div);
        });

    } catch (err) {
        console.log("Error loading products", err);
    }
}

loadProducts();


// Add product
async function addProduct() {

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").value;

    if (!name || !price || !image) {
        alert("Fill all fields");
        return;
    }

    try {
        await fetch(`${API_URL}/api/products/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                price,
                image
            })
        });

        alert("Product added");
        loadProducts();

    } catch (err) {
        console.log("Add error", err);
    }
}


// Delete product
async function deleteProduct(id) {

    try {
        await fetch(`${API_URL}/api/products/${id}`, {
            method: "DELETE"
        });

        loadProducts();

    } catch (err) {
        console.log("Delete error", err);
    }
}