const API_URL = "https://movie-ecommerce-backend.onrender.com/user/login";

document.getElementById("loginForm").addEventListener("submit", async function(e){

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const passError = document.getElementById("passError");
    passError.innerText = "";

    // ✅ BASIC VALIDATION
    if(!email || !password){
        passError.innerText = "Please enter email and password";
        return;
    }

    try{

        const response = await fetch(API_URL,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email: email,
                password: password
            })
        });

        if(response.ok){
            // ✅ SUCCESS (🔥 FIXED)
            const data = await response.json();

            // ✅ STORE CORRECT USER DATA
            localStorage.setItem("userId", data.id);
            localStorage.setItem("userName", data.name);
            localStorage.setItem("token", data.token);
            localStorage.setItem("userEmail", data.email);
            localStorage.setItem("role", data.role);

            console.log("Login successful:", data);

            window.location.href = "/index.html";

        } else {
            // ❌ ERROR FROM BACKEND
            const errorText = await response.text();
            console.error("Login Error:", errorText);

            passError.innerText = errorText || "Login failed";
        }

    } catch(error){
        console.error("Fetch Error:", error);
        passError.innerText = "Server error. Make sure backend is running.";
    }

});