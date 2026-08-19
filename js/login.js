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

        if (name.length < 2) {
            alert("Please enter your full name.");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;
        }

        const user = {
            name: name,
            email: email,
            password: password
        };

        const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
        const existingUser = users.find(account => account.email === email);

        if (existingUser) {
            alert("An account with this email already exists.");
            return;
        }

        users.push(user);
        localStorage.setItem("registeredUsers", JSON.stringify(users));
        localStorage.setItem("registeredUser", JSON.stringify(user));

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

        const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
        const legacyUser = JSON.parse(localStorage.getItem("registeredUser"));
        const accounts = registeredUsers.length > 0 ? registeredUsers : (legacyUser ? [legacyUser] : []);
        const registeredUser = accounts.find(account => account.email === email);

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