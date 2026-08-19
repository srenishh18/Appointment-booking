document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const appointmentList = document.getElementById("appointmentList");

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

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
            provider: "Dr. Priya Sharma - Consultant",
            date: "2026-08-28",
            time: "02:00 PM",
            purpose: "Routine Consultation",
            userEmail: "user@example.com",
            status: "Confirmed",
            createdAt: new Date().toISOString()
        },
        {
            id: "APT1003",
            provider: "Rahul Menon - Career Consultant",
            date: "2026-08-10",
            time: "11:00 AM",
            purpose: "Career Guidance",
            userEmail: "user@example.com",
            status: "Completed",
            createdAt: new Date().toISOString()
        }
    ];

    let allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    if (allAppointments.length === 0) {
        allAppointments = defaultDemoAppointments;
        localStorage.setItem("appointments", JSON.stringify(allAppointments));
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updatedAppointments = allAppointments.map(appointment =>
        appointment.status === "Confirmed" && new Date(`${appointment.date}T00:00:00`) < today
            ? { ...appointment, status: "Completed" }
            : appointment
    );

    if (JSON.stringify(updatedAppointments) !== JSON.stringify(allAppointments)) {
        localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
        allAppointments = updatedAppointments;
    }

    const userEmail = (currentUser.email || "").toLowerCase();
    const userAppointments = allAppointments.filter(appointment =>
        (appointment.userEmail || "").toLowerCase() === userEmail
    );

    const upcomingAppointments = userAppointments.filter(appointment =>
        appointment.status === "Confirmed" && new Date(`${appointment.date}T00:00:00`) >= today
    );
    const completedAppointments = userAppointments.filter(appointment =>
        appointment.status === "Completed"
    );

    document.getElementById("totalAppointments").textContent = userAppointments.length;
    document.getElementById("upcomingAppointments").textContent = upcomingAppointments.length;
    document.getElementById("completedAppointments").textContent = completedAppointments.length;

    if (userAppointments.length === 0) {
        appointmentList.innerHTML = `
            <div class="empty-state">
                <strong>No appointments yet</strong>
                <p>Book your first appointment to see it here.</p>
                <a href="providers.html" class="btn primary">Find a Provider</a>
            </div>
        `;
        return;
    }

    appointmentList.innerHTML = userAppointments.map(appointment => {
        const canCancel = appointment.status === "Confirmed";
        return `
            <article class="appointment-card">
                <div>
                    <p class="appointment-id">${appointment.id}</p>
                    <h3>${appointment.provider}</h3>
                    <p>${appointment.date} at ${appointment.time}</p>
                    <p>${appointment.purpose}</p>
                </div>
                <div class="appointment-actions">
                    <span class="status ${appointment.status.toLowerCase()}">${appointment.status}</span>
                    ${canCancel ? `<button class="btn danger" data-appointment-id="${appointment.id}">Cancel</button>` : ""}
                </div>
            </article>
        `;
    }).join("");

    appointmentList.addEventListener("click", event => {
        const cancelButton = event.target.closest("[data-appointment-id]");
        if (!cancelButton || !window.confirm("Cancel this appointment?")) return;

        const appointmentId = cancelButton.dataset.appointmentId;
        const updatedAppointments = allAppointments.map(appointment =>
            appointment.id === appointmentId
                ? { ...appointment, status: "Cancelled" }
                : appointment
        );

        localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
        window.location.reload();
    });
});
