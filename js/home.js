// CHECK LOGIN FIRST
document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login.html";
        return;
    }

    loadProducts();
});

// ================================
// Mood-Based E-Commerce Home JS
// ================================

let products = []
let filteredProducts = []

// Welcome message (safe load)
let username = localStorage.getItem("userName") || "User";
document.addEventListener("DOMContentLoaded", () => {
    const welcomeEl = document.getElementById("welcomeUser");
    if (welcomeEl) {
        welcomeEl.innerText = "Welcome " + username;
    }
});

// ================================
// Load products from backend
// ================================

const API_URL = "https://movie-ecommerce-backend.onrender.com/api/products";

async function loadProducts(mood = "") {
    let url = API_URL;
    if (mood && mood !== "all") url += `/mood/${mood}`;

    try {
        const token = localStorage.getItem("token");
        console.log("TOKEN:", token);

         const res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        console.log("STATUS:", res.status);

        products = await res.json();
        console.log("Products received:", products);
        console.log("PRODUCTS:", products);

        filteredProducts = products;
        displayProducts(filteredProducts);

    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Initial load


// ================================
// Display products
// ================================

function displayProducts(products) {
    const container = document.getElementById("product-container");
    container.innerHTML = "";

     // ✅ FIX 4 — SAFETY CHECK (ADD HERE)
    if (!products || products.length === 0) {
        container.innerHTML = "<h3>No products found</h3>";
        return;
    }

    products.forEach(product => {
        const stars = generateStars(product.rating || 4);

        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${product.image}" class="product-image"
                 onclick="goToProduct('${product._id}')"

            <div class="product-details">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">₹${product.price}</p>
                <div class="rating">${stars}</div>
            </div>

            <div class="product-buttons">
    <button onclick="addToCart('${product._id}', '${product.name}', ${product.price}, '${product.image}')">
        Add to Cart
    </button>

    <button onclick="addToWishlist('${product._id}', '${product.name}', ${product.price}, '${product.image}')">
        Wishlist
    </button>

    <button onclick="buyNow('${product.id}', '${product.name}', ${product.price}, '${product.image}')">
        Buy Now
    </button>
</div>
        `;

        container.appendChild(card);
    });
}

// ================================
// Generate star rating
// ================================

function generateStars(rating) {
    let stars = ""
    let fullStars = Math.floor(rating)
    for (let i = 0; i < fullStars; i++) stars += "⭐"
    if (rating - fullStars >= 0.5) stars += "✨"
    return stars
}

// ================================
// Mood Filter
// ================================

function filterMood(mood) {
    if (mood === "all") {
        filteredProducts = products
    } else {
        filteredProducts = products.filter(p => p.mood === mood)
    }
    displayProducts(filteredProducts)
}

// ================================
// Search
// ================================

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("keyup", function() {
            const value = this.value.toLowerCase()
            const results = products.filter(p => p.name.toLowerCase().includes(value))
            displayProducts(results)
        });
    }
});

// ================================
// Add to Cart
// ================================

async function addToCart(productId, productName, price, image, quantity = 1) {
    try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        const res = await fetch("https://movie-ecommerce-backend.onrender.com/cart/add",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                userId,
                productId,
                productName,
                price,
                image,
                quantity
            })
        });

        // ✅ HANDLE NON-OK RESPONSE FIRST
        if (!res.ok) {
            const text = await res.text();
            console.error("Cart Error:", text);

            if (res.status === 403) {
                alert("❌ Unauthorized. Please login again.");
                return;
            }

            alert("❌ Failed to add to cart");
            return;
        }

        // ✅ SAFE JSON PARSE (ONLY IF BODY EXISTS)
        let data = null;
        try {
            data = await res.json();
        } catch (e) {
            // ignore empty response
        }

        console.log("Cart Response:", data);

        alert("✅ Product added to cart");

    } catch (error) {
        console.error("Cart Error:", error);
        alert("❌ Failed to add to cart");
    }
}


// ================================
// Add to Wishlist
// ================================

async function addToWishlist(productId, productName, price, image) {
    try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        const res = await fetch("https://movie-ecommerce-backend.onrender.com/wishlist/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                userId,
                productId,
                productName,
                price,
                image
            })
        });

        // ✅ HANDLE NON-OK RESPONSE FIRST
        if (!res.ok) {
            const text = await res.text();
            console.error("Wishlist Error:", text);

            if (res.status === 403) {
                alert("❌ Unauthorized. Please login again.");
                return;
            }

            alert("❌ Failed to add to wishlist");
            return;
        }

        // ✅ SAFE JSON PARSE
        let data = null;
        try {
            data = await res.json();
        } catch (e) {
            // ignore empty response
        }

        console.log("Wishlist Response:", data);

        alert("✅ Product added to wishlist");

    } catch (error) {
        console.error("Wishlist Error:", error);
        alert("❌ Failed to add to wishlist");
    }
}

// ================================
// Navigation
// ================================

function goProfile() { window.location.href = "profile.html" }
function goCart() { window.location.href = "cart.html" }
function goWishlist() { window.location.href = "wishlist.html" }
function goCheckout() { window.location.href = "checkout.html" }

function logout() {
    localStorage.clear()
    window.location.href = "index.html"
}

function goToProduct(id){
    window.location.href = "product.html?id=" + id;
}



function buyNow(id, name, price, image) {

    const product = {
        productId: id,
        productName: name,
        price: price,
        image: image,
        quantity: 1
    };

    // store in localStorage
    localStorage.setItem("checkoutItem", JSON.stringify(product));

    // go to checkout page
    window.location.href = "checkout.html";
}

function goMoodPage(){
    window.location.href = "mood.html"; // your mood page file name
}