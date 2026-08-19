// AppointEase - Common JavaScript

document.addEventListener("DOMContentLoaded", () => {

    const user = JSON.parse(localStorage.getItem("currentUser"));

    const loginLink = document.getElementById("loginLink");

    if (loginLink && user) {
        loginLink.textContent = "Dashboard";
        loginLink.href = "appointments.html";
    }

    // Profile page
    if (user) {

        const profileName = document.getElementById("profileName");
        const profileEmail = document.getElementById("profileEmail");
        const nameField = document.getElementById("nameField");
        const emailField = document.getElementById("emailField");

        if (profileName) profileName.textContent = user.name;
        if (profileEmail) profileEmail.textContent = user.email;

        if (nameField) nameField.textContent = user.name;
        if (emailField) emailField.textContent = user.email;
    }

});


function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "index.html";
}
