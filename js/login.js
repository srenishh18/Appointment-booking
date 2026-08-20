// Pre-seed default demo accounts
const defaultDemoUsers = [
    {
        name: "Alex Johnson",
        email: "user@example.com",
        password: "password123",
        role: "user"
    },
    {
        name: "Admin User",
        email: "admin@example.com",
        password: "adminpassword",
        role: "admin"
    },
    {
        name: "Dr. Arun Kumar",
        email: "arun@provider.com",
        password: "provider123",
        role: "provider",
        specialty: "General Physician"
    },
    {
        name: "Dr. Priya Sharma",
        email: "priya@provider.com",
        password: "provider123",
        role: "provider",
        specialty: "Consultant"
    },
    {
        name: "Rahul Menon",
        email: "rahul@provider.com",
        password: "provider123",
        role: "provider",
        specialty: "Career Consultant"
    },
    {
        name: "Maya Patel",
        email: "maya@example.com",
        password: "password123",
        role: "user"
    }
];

const defaultDemoAppointments = [
    {
        id: "APT1001",
        provider: "Dr. Arun Kumar - General Physician",
        date: "2026-08-25",
        time: "10:00 AM",
        purpose: "General Health Checkup",
        userEmail: "user@example.com",
        status: "Confirmed",
        createdAt: new Date().toISOString()
    },
    {
        id: "APT1002",
        provider: "Dr. Arun Kumar - General Physician",
        date: "2026-08-25",
        time: "10:00 AM",
        purpose: "Urgent Medical Review",
        userEmail: "guest@example.com",
        status: "Pending",
        createdAt: new Date().toISOString()
    },
    {
        id: "APT1003",
        provider: "Dr. Priya Sharma - Consultant",
        date: "2026-08-28",
        time: "02:00 PM",
        purpose: "Routine Consultation",
        userEmail: "user@example.com",
        status: "Confirmed",
        createdAt: new Date().toISOString()
    },
    {
        id: "APT1004",
        provider: "Rahul Menon - Career Consultant",
        date: "2026-08-10",
        time: "11:00 AM",
        purpose: "Career Guidance",
        userEmail: "user@example.com",
        status: "Completed",
        createdAt: new Date().toISOString()
    },
    {
        id: "APT1005",
        provider: "Dr. Priya Sharma - Consultant",
        date: "2026-09-02",
        time: "09:30 AM",
        purpose: "Follow-up Consultation",
        userEmail: "maya@example.com",
        status: "Pending",
        createdAt: new Date().toISOString()
    },
    {
        id: "APT1006",
        provider: "Dr. Arun Kumar - General Physician",
        date: "2026-09-04",
        time: "03:00 PM",
        purpose: "Preventive Health Review",
        userEmail: "maya@example.com",
        status: "Confirmed",
        createdAt: new Date().toISOString()
    },
    {
        id: "APT1007",
        provider: "Rahul Menon - Career Consultant",
        date: "2026-08-30",
        time: "01:00 PM",
        purpose: "Resume Review",
        userEmail: "user@example.com",
        status: "Cancelled",
        createdAt: new Date().toISOString()
    }
];

function seedDemoData() {
    let users = [];
    try {
        users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    } catch (e) {
        users = [];
    }

    defaultDemoUsers.forEach(demo => {
        if (!users.some(u => u && u.email && u.email.toLowerCase() === demo.email.toLowerCase())) {
            users.push(demo);
        }
    });
    localStorage.setItem("registeredUsers", JSON.stringify(users));

    let appointments = [];
    try {
        appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    } catch (e) {
        appointments = [];
    }

    defaultDemoAppointments.forEach(demo => {
        if (!appointments.some(appointment => appointment && appointment.id === demo.id)) {
            appointments.push(demo);
        }
    });
    localStorage.setItem("appointments", JSON.stringify(appointments));
}

// Seed on script load
seedDemoData();

// Quick-fill helper functions for demo buttons
function fillDemoUser() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    if (emailInput && passwordInput) {
        emailInput.value = "user@example.com";
        passwordInput.value = "password123";
    }
}

function fillDemoAdmin() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    if (emailInput && passwordInput) {
        emailInput.value = "admin@example.com";
        passwordInput.value = "adminpassword";
    }
}

function fillDemoProvider() {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    if (emailInput && passwordInput) {
        emailInput.value = "arun@provider.com";
        passwordInput.value = "provider123";
    }
}

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

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

        const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
        const existingUser = users.find(account => account && account.email && account.email.toLowerCase() === email.toLowerCase());

        if (existingUser) {
            alert("An account with this email already exists.");
            return;
        }

        const newUser = {
            name: name,
            email: email,
            password: password,
            role: "user"
        };

        users.push(newUser);
        localStorage.setItem("registeredUsers", JSON.stringify(users));
        localStorage.setItem("currentUser", JSON.stringify(newUser));

        alert("Registration successful!");
        window.location.href = "appointments.html";
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        let registeredUsers = [];
        try {
            registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || defaultDemoUsers;
        } catch (e) {
            registeredUsers = defaultDemoUsers;
        }

        const registeredUser = registeredUsers.find(account => account && account.email && account.email.toLowerCase() === email);

        if (!registeredUser) {
            alert("No account found with this email. Click one of the Quick Demo Login buttons below!");
            return;
        }

        if (password === registeredUser.password) {
            localStorage.setItem("currentUser", JSON.stringify(registeredUser));
            alert(`Login successful! Welcome ${registeredUser.name}`);

            if (registeredUser.email.toLowerCase() === "admin@example.com" || registeredUser.role === "admin") {
                window.location.href = "admin.html";
            } else if (registeredUser.role === "provider" || registeredUser.email.toLowerCase().includes("@provider.com")) {
                window.location.href = "provider-dashboard.html";
            } else {
                window.location.href = "appointments.html";
            }
        } else {
            alert("Invalid password.");
        }
    });
}