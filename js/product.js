const API_URL = "http://localhost:8081/api/products";

async function loadProduct() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    const res = await fetch(API_URL);
    const products = await res.json();

    const product = products.find(p => p.id === productId);

    displayProduct(product);
}

function displayProduct(product) {
    const container = document.getElementById("productDetails");

    container.innerHTML = `
        <div style="display:flex; gap:30px;">

            <img src="${product.image}" width="300">

            <div>
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <h3>₹${product.price}</h3>

                <div>
                    <button onclick="changeQty(-1)">-</button>
                    <span id="qty">1</span>
                    <button onclick="changeQty(1)">+</button>
                </div>

                <br>

                <button onclick="addToCart('${product.id}', '${product.name}', ${product.price}, '${product.image}')">
                    Add to Cart
                </button>
            </div>

        </div>
    `;
}

let quantity = 1;

function changeQty(val) {
    quantity += val;
    if (quantity < 1) quantity = 1;
    document.getElementById("qty").innerText = quantity;
}

async function addToCart(productId, productName, price, image) {
    const userId = localStorage.getItem("userId");

    await fetch("http://localhost:8081/cart/add", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            userId,
            productId,
            productName,
            price,
            image,
            quantity
        })
    });

    alert("Added to cart");
}

loadProduct();