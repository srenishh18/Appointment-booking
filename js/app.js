// Shared System Providers Store
const defaultProvidersList = [
    { id: 1, name: "Dr. Arun Kumar", specialty: "General Physician", experience: "8 years", rating: "4.8", icon: "👨‍⚕️", email: "arun@provider.com" },
    { id: 2, name: "Dr. Priya Sharma", specialty: "Consultant", experience: "6 years", rating: "4.7", icon: "👩‍⚕️", email: "priya@provider.com" },
    { id: 3, name: "Rahul Menon", specialty: "Career Consultant", experience: "10 years", rating: "4.9", icon: "👨‍💼", email: "rahul@provider.com" },
    { id: 4, name: "Ananya Rao", specialty: "Student Counselor", experience: "5 years", rating: "4.6", icon: "👩‍💼", email: "ananya@provider.com" },
    { id: 5, name: "Marcus Vance", specialty: "Legal Advisor", experience: "12 years", rating: "4.9", icon: "⚖️", email: "marcus@provider.com" }
];

const sharedDemoUsers = [
    { name: "Alex Johnson", email: "user@example.com", password: "password123", role: "user" },
    { name: "Maya Patel", email: "maya@example.com", password: "password123", role: "user" },
    { name: "Admin User", email: "admin@example.com", password: "adminpassword", role: "admin" },
    { name: "Dr. Arun Kumar", email: "arun@provider.com", password: "provider123", role: "provider", specialty: "General Physician" },
    { name: "Dr. Priya Sharma", email: "priya@provider.com", password: "provider123", role: "provider", specialty: "Consultant" },
    { name: "Rahul Menon", email: "rahul@provider.com", password: "provider123", role: "provider", specialty: "Career Consultant" },
    { name: "Ananya Rao", email: "ananya@provider.com", password: "provider123", role: "provider", specialty: "Student Counselor" },
    { name: "Marcus Vance", email: "marcus@provider.com", password: "provider123", role: "provider", specialty: "Legal Advisor" }
];

function seedSharedDemoUsers() {
    let users = [];
    try {
        users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    } catch (e) {
        users = [];
    }

    sharedDemoUsers.forEach(demo => {
        if (!users.some(user => user && user.email && user.email.toLowerCase() === demo.email)) {
            users.push(demo);
        }
    });
    localStorage.setItem("registeredUsers", JSON.stringify(users));
}

const sharedDemoAppointments = [
    { id: "APT1001", provider: "Dr. Arun Kumar - General Physician", date: "2026-08-25", time: "10:00 AM", purpose: "General Health Checkup", userEmail: "user@example.com", status: "Confirmed" },
    { id: "APT1002", provider: "Dr. Arun Kumar - General Physician", date: "2026-08-25", time: "10:00 AM", purpose: "Urgent Medical Review", userEmail: "guest@example.com", status: "Pending" },
    { id: "APT1003", provider: "Dr. Priya Sharma - Consultant", date: "2026-08-28", time: "02:00 PM", purpose: "Routine Consultation", userEmail: "user@example.com", status: "Confirmed" },
    { id: "APT1004", provider: "Rahul Menon - Career Consultant", date: "2026-08-10", time: "11:00 AM", purpose: "Career Guidance", userEmail: "user@example.com", status: "Completed" },
    { id: "APT1005", provider: "Dr. Priya Sharma - Consultant", date: "2026-09-02", time: "09:30 AM", purpose: "Follow-up Consultation", userEmail: "maya@example.com", status: "Pending" },
    { id: "APT1006", provider: "Dr. Arun Kumar - General Physician", date: "2026-09-04", time: "03:00 PM", purpose: "Preventive Health Review", userEmail: "maya@example.com", status: "Confirmed" },
    { id: "APT1007", provider: "Rahul Menon - Career Consultant", date: "2026-08-30", time: "01:00 PM", purpose: "Resume Review", userEmail: "user@example.com", status: "Cancelled" }
];

function seedSharedDemoAppointments() {
    let appointments = [];
    try {
        appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    } catch (e) {
        appointments = [];
    }

    sharedDemoAppointments.forEach(demo => {
        if (!appointments.some(appointment => appointment && appointment.id === demo.id)) {
            appointments.push({ ...demo, createdAt: new Date().toISOString() });
        }
    });
    localStorage.setItem("appointments", JSON.stringify(appointments));
}

seedSharedDemoUsers();
seedSharedDemoAppointments();

function getStoredProviders() {
    const stored = localStorage.getItem("systemProviders");
    if (!stored) {
        localStorage.setItem("systemProviders", JSON.stringify(defaultProvidersList));
        return defaultProvidersList;
    }
    try {
        const parsed = JSON.parse(stored);
        return (Array.isArray(parsed) && parsed.length > 0) ? parsed : defaultProvidersList;
    } catch (e) {
        return defaultProvidersList;
    }
}

function saveStoredProviders(list) {
    localStorage.setItem("systemProviders", JSON.stringify(list));
}

document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const navLinks = document.querySelector(".nav-links");

    if (user && navLinks) {
        const isAdmin = user.role === "admin" || (user.email && user.email.toLowerCase() === "admin@example.com");
        const isProvider = user.role === "provider" || (user.email && user.email.toLowerCase().includes("@provider.com"));

        if (isAdmin) {
            let adminBtn = document.getElementById("adminDashboardNavLink");
            if (!adminBtn) {
                adminBtn = document.createElement("a");
                adminBtn.id = "adminDashboardNavLink";
                adminBtn.href = "admin.html";
                adminBtn.innerHTML = "🛡️ Admin Dashboard";
                adminBtn.style.cssText = "background: #fef3c7; color: #92400e; font-weight: 700; border: 1.5px solid #fde68a; padding: 6px 16px; border-radius: 9999px; transition: all 0.2s ease;";
                
                if (window.location.pathname.endsWith("admin.html")) {
                    adminBtn.style.background = "#0d9488";
                    adminBtn.style.color = "#ffffff";
                    adminBtn.style.borderColor = "#0f766e";
                }
                navLinks.insertBefore(adminBtn, navLinks.firstChild);
            }
        } else if (isProvider) {
            let providerBtn = document.getElementById("providerDashboardNavLink");
            if (!providerBtn) {
                providerBtn = document.createElement("a");
                providerBtn.id = "providerDashboardNavLink";
                providerBtn.href = "provider-dashboard.html";
                providerBtn.innerHTML = "💼 Provider Dashboard";
                providerBtn.style.cssText = "background: #e0e7ff; color: #3730a3; font-weight: 700; border: 1.5px solid #c7d2fe; padding: 6px 16px; border-radius: 9999px; transition: all 0.2s ease;";
                
                if (window.location.pathname.endsWith("provider-dashboard.html")) {
                    providerBtn.style.background = "#4f46e5";
                    providerBtn.style.color = "#ffffff";
                    providerBtn.style.borderColor = "#4338ca";
                }
                navLinks.insertBefore(providerBtn, navLinks.firstChild);
            }
        }
    }

    const loginLink = document.getElementById("loginLink");
    if (loginLink) {
        if (user) {
            loginLink.textContent = "Profile";
            loginLink.href = "profile.html";
        } else {
            loginLink.textContent = "Login";
            loginLink.href = "login.html";
        }
    }

    // Profile page pre-fill
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
