const container = document.getElementById("checkoutContainer");
const historyContainer = document.getElementById("historyContainer");

// ================================
// LOAD CHECKOUT PRODUCT
// ================================
function loadCheckout() {

    const data = localStorage.getItem("checkoutItem");

    if (!data) {
        container.innerHTML = "<h3>No product selected</h3>";
        return;
    }

    const item = JSON.parse(data);

    displayProducts([item]);
}

loadCheckout();

// ================================
// DISPLAY PRODUCTS + TOTAL
// ================================
function displayProducts(items){

    container.innerHTML="";
    let total = 0;

    items.forEach(item=>{

        total += item.price * (item.quantity || 1);

        const card=document.createElement("div");

        card.classList.add("product-card");

        card.innerHTML=`
            <img src="${item.image}">

            <div class="product-name">${item.productName}</div>

            <div class="product-price">₹ ${item.price}</div>

            <div>Qty: ${item.quantity || 1}</div>
        `;

        container.appendChild(card);
    });

    // TOTAL
    const totalDiv = document.createElement("h3");
    totalDiv.innerText = "Total: ₹ " + total;
    container.appendChild(totalDiv);
}

// ================================
// MAKE PAYMENT + SAVE HISTORY
// ================================
async function makePayment(){

    const payment = document.querySelector('input[name="payment"]:checked');

    if(!payment){
        alert("Select payment method");
        return;
    }

    const userId = localStorage.getItem("userId");
    const data = localStorage.getItem("checkoutItem");

    if(!data){
        alert("No product found");
        return;
    }

    const item = JSON.parse(data);

    try{

        await fetch("http://localhost:8081/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                productName: item.productName,
                price: item.price,
                quantity: item.quantity || 1,
                image: item.image,
                paymentMethod: payment.value
            })
        });

        alert("Payment Successful ✅");

        localStorage.removeItem("checkoutItem");

        loadHistory();

    } catch(error){
        console.log("Payment error", error);
    }
}

// ================================
// LOAD PAYMENT HISTORY
// ================================
async function loadHistory(){

    try{

        const userId = localStorage.getItem("userId");

        const response = await fetch("http://localhost:8081/order/" + userId);

        const history = await response.json();

        console.log("History:", history);

        displayHistory(history);

    } catch(error){
        console.log("History error", error);
    }
}

// ================================
// DISPLAY HISTORY
// ================================
function displayHistory(history){

    historyContainer.innerHTML = "";

    if(history.length === 0){
        historyContainer.innerHTML = "<h3>No Orders Yet</h3>";
        return;
    }

    history.forEach(order => {

        const div = document.createElement("div");

        div.classList.add("history-item");

        div.innerHTML = `
            <img src="${order.image}" width="80">
            <br>
            ${order.productName}
            <br>
            ₹${order.price}
            <br>
            Qty: ${order.quantity}
            <br>
            Payment: ${order.paymentMethod}
            <br>
            Total: ₹${order.totalAmount}
        `;

        historyContainer.appendChild(div);
    });
}

// ================================
// CLEAR HISTORY
// ================================
async function clearHistory(){

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    await fetch("http://localhost:8081/orders/" + userId, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    loadHistory();

    alert("History Cleared");
}