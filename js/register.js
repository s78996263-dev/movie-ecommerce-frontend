const API_URL = "https://movie-ecommerce-backend.onrender.com/user/register";

document.getElementById("registerForm").addEventListener("submit", async function(e){

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const gender = document.getElementById("gender").value;
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const password = document.getElementById("password").value.trim();

    const errorMsg = document.getElementById("errorMsg");
    errorMsg.innerText = "";

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                gender: gender,
                email: email,
                phone: phone,
                address: address,
                password: password
            })
        });

        // ✅ SUCCESS
        if(response.ok){
            alert("Registration successful!");
            window.location.href = "/login.html";
        } 
        // ❌ USER EXISTS
        else if(response.status === 409){
            errorMsg.innerText = "User already exists. Please login.";

            setTimeout(() => {
                window.location.href = "/login.html";
            }, 2000);
        } 
        // ❌ OTHER ERROR
        else {
            const errorText = await response.text();
            alert(errorText || "Something went wrong");
        }

    } catch(error) {
        errorMsg.innerText = "Server error. Check backend.";
    }

});