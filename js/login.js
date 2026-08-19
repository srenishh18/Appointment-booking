const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;
        }

        const user = {
            name: name,
            email: email,
            password: password
        };

        localStorage.setItem(
            "registeredUser",
            JSON.stringify(user)
        );

        alert("Registration successful!");

        window.location.href = "login.html";
    });
}


const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const registeredUser =
            JSON.parse(localStorage.getItem("registeredUser"));

        if (!registeredUser) {

            alert("No account found. Please register first.");

            return;
        }

        if (
            email === registeredUser.email &&
            password === registeredUser.password
        ) {

            localStorage.setItem(
                "currentUser",
                JSON.stringify(registeredUser)
            );

            alert("Login successful!");

            window.location.href = "appointments.html";

        } else {

            alert("Invalid email or password.");
        }

    });
}