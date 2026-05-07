const API_URL = "http://localhost:8081";

const container = document.getElementById("cartContainer");
const count = document.getElementById("cartCount");

// Load cart from backend (WITH TOKEN)
async function loadCart() {
    try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId) {
            alert("Please login first");
            window.location.href = "login.html";
            return;
        }

        const response = await fetch(`${API_URL}/cart/${userId}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const cartItems = await response.json();

        console.log("Cart API Response:", cartItems);

        count.innerText = cartItems.length;

        if (cartItems.length === 0) {
            container.innerHTML = "<h3 style='text-align:center'>Cart is empty</h3>";
            return;
        }

        displayCart(cartItems);

    } catch (error) {
        console.log("Error loading cart", error);
    }
}

// Run on page load
window.addEventListener("load", loadCart);

// Display products
function displayCart(items) {

    container.innerHTML = "";

    items.forEach(item => {

        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${item.image}">

            <div class="product-name">${item.productName}</div>

            <div class="product-price">₹ ${item.price}</div>

            <div>
                <button onclick="updateQty('${item.id}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQty('${item.id}', 1)">+</button>
            </div>

           <div class="product-buttons">
    <button onclick="removeCart('${item.id}')">Remove</button>

    <button onclick="buyNowCart('${item.id}', '${item.productName}', ${item.price}, '${item.image}', ${item.quantity})">
        Buy Now
    </button>
</div>
        `;

        container.appendChild(card);
    });
}

// Remove item (WITH TOKEN)
async function removeCart(cartId) {
    try {
        const token = localStorage.getItem("token");

        await fetch(`${API_URL}/cart/${cartId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        loadCart();

    } catch (error) {
        console.log("Remove error", error);
    }
}

// Buy Now (WITH TOKEN)


// Update Quantity (WITH TOKEN)
async function updateQty(cartId, change) {
    try {
        const token = localStorage.getItem("token");

        await fetch(`${API_URL}/cart/update/${cartId}?change=${change}`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        loadCart();

    } catch (error) {
        console.log("Update error", error);
    }
}


function buyNowCart(id, name, price, image, quantity) {

    const product = {
        productId: id,
        productName: name,
        price: price,
        image: image,
        quantity: quantity
    };

    // store selected cart item
    localStorage.setItem("checkoutItem", JSON.stringify(product));

    // redirect to checkout
    window.location.href = "checkout.html";
}