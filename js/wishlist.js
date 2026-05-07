const API_URL = "http://localhost:8081";

const container = document.getElementById("wishlistContainer");
const count = document.getElementById("wishlistCount");

// ================================
// Load Wishlist from Backend (WITH TOKEN)
// ================================

async function loadWishlist() {

    try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId) {
            alert("Please login first");
            window.location.href = "login.html";
            return;
        }

        // 🔥 Loader
        container.innerHTML = "<h3 style='text-align:center'>Loading wishlist...</h3>";

        const response = await fetch(`${API_URL}/wishlist/${userId}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const items = await response.json();

        console.log("Wishlist API Response:", items);

        count.innerText = items.length;

        if (items.length === 0) {
            container.innerHTML = "<h3 style='text-align:center'>Wishlist is empty</h3>";
            return;
        }

        displayWishlist(items);

    } catch (error) {
        console.log("Error loading wishlist", error);
        container.innerHTML = "<h3 style='text-align:center'>Error loading wishlist</h3>";
    }
}

// Run on page load
window.addEventListener("load", loadWishlist);


// ================================
// Display Wishlist Products
// ================================

function displayWishlist(items) {

    container.innerHTML = "";

    items.forEach(item => {

        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${item.image}">

            <div class="product-name">${item.productName}</div>

            <div class="product-price">₹ ${item.price}</div>

            <div class="product-buttons">
                <button onclick="addToCart('${item.productId}', '${item.productName}', ${item.price}, '${item.image}')">
                    Add to Cart
                </button>

                <button onclick="removeWishlist('${item.id}')">
                    Remove
                </button>
            </div>
        `;

        container.appendChild(card);
    });
}


// ================================
// Add to Cart (WITH TOKEN)
// ================================

async function addToCart(productId, productName, price, image) {

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
        await fetch(`${API_URL}/cart/add`, {
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
                quantity: 1
            })
        });

        alert("Product added to cart");

    } catch (error) {
        console.log("Cart error", error);
    }
}


// ================================
// Remove from Wishlist (WITH TOKEN)
// ================================

async function removeWishlist(id) {

    try {
        const token = localStorage.getItem("token");

        await fetch(`${API_URL}/wishlist/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        loadWishlist();

    } catch (error) {
        console.log("Remove error", error);
    }
}