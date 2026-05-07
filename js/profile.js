const userId = localStorage.getItem("userId");

// If not logged in
if (!userId) {
    alert("Please login first");
    window.location.href = "login.html";
}

// LOAD USER DATA
window.onload = async function () {

    try {
        const response = await fetch("http://localhost:8081/user/" + userId);

        if (response.ok) {
            const user = await response.json();

            console.log("User Data:", user);

            document.getElementById("name").value = user.name || "";
            document.getElementById("email").value = user.email || "";
            document.getElementById("phone").value = user.phone || "";
            document.getElementById("address").value = user.address || "";
        } else {
            alert("User not found");
        }

    } catch (error) {
        alert("Error loading profile");
    }
};

// UPDATE USER
document.getElementById("profileForm").addEventListener("submit", async function (e) {

    e.preventDefault();

    const updatedUser = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value
    };

    try {
        const response = await fetch("http://localhost:8081/user/" + userId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedUser)
        });

        if (response.ok) {
            alert("Profile updated successfully ✅");
        } else {
            alert("Update failed");
        }

    } catch (error) {
        alert("Server error");
    }
});