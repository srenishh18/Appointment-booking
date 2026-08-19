const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        window.location.href = "login.html";
    }

    const providerSelect = document.getElementById("provider");
    const dateInput = document.getElementById("date");
    const timeSelect = document.getElementById("time");

    const systemProviders = typeof getStoredProviders === "function" ? getStoredProviders() : [];

    if (providerSelect && systemProviders.length > 0) {
        providerSelect.innerHTML = '<option value="">Select Service Provider</option>';
        systemProviders.forEach(p => {
            const val = `${p.name} - ${p.specialty}`;
            const opt = document.createElement("option");
            opt.value = val;
            opt.textContent = `${p.icon || '💼'} ${val}`;
            opt.dataset.id = p.id;
            providerSelect.appendChild(opt);
        });
    }

    const providerId = Number(new URLSearchParams(window.location.search).get("provider"));

    if (providerId > 0 && providerSelect) {
        const matchingOptIndex = Array.from(providerSelect.options).findIndex(opt => Number(opt.dataset.id) === providerId);
        if (matchingOptIndex >= 0) {
            providerSelect.selectedIndex = matchingOptIndex;
        }
    }

    // Prevent selecting previous dates
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    if (dateInput) {
        dateInput.min = `${year}-${month}-${day}`;
    }

    // Slot Conflict Checking function
    function checkSlotConflict() {
        const warningBox = document.getElementById("slotConflictWarning");
        if (!warningBox) return;

        const providerVal = providerSelect ? providerSelect.value : "";
        const dateVal = dateInput ? dateInput.value : "";
        const timeVal = timeSelect ? timeSelect.value : "";

        if (providerVal && dateVal && timeVal) {
            const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
            const existingCount = allAppointments.filter(app =>
                app.status !== "Cancelled" &&
                app.provider === providerVal &&
                app.date === dateVal &&
                app.time === timeVal
            ).length;

            if (existingCount > 0) {
                warningBox.style.display = "block";
                warningBox.innerHTML = `⚠️ <strong>Time Slot Warning:</strong> This provider already has ${existingCount} active booking(s) requested for ${dateVal} at ${timeVal}. Your request will be queued for provider/admin review.`;
            } else {
                warningBox.style.display = "none";
            }
        } else {
            warningBox.style.display = "none";
        }
    }

    if (providerSelect) providerSelect.addEventListener("change", checkSlotConflict);
    if (dateInput) dateInput.addEventListener("change", checkSlotConflict);
    if (timeSelect) timeSelect.addEventListener("change", checkSlotConflict);

    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const provider = providerSelect.value;
        const date = dateInput.value;
        const time = timeSelect.value;
        const purpose = document.getElementById("purpose").value;

        const appointment = {
            id: "APT" + Math.floor(1000 + Math.random() * 9000),
            provider: provider,
            date: date,
            time: time,
            purpose: purpose,
            userEmail: currentUser.email,
            status: "Pending",
            createdAt: new Date().toISOString()
        };

        let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        appointments.push(appointment);
        localStorage.setItem("appointments", JSON.stringify(appointments));

        document.getElementById("appointmentDetails").innerHTML = `
            <span class="confirmation-row"><strong>Appointment ID</strong><span>${appointment.id}</span></span>
            <span class="confirmation-row"><strong>Provider</strong><span>${provider}</span></span>
            <span class="confirmation-row"><strong>Date</strong><span>${date}</span></span>
            <span class="confirmation-row"><strong>Time</strong><span>${time}</span></span>
            <span class="confirmation-row"><strong>Status</strong><span class="status pending">Pending Approval</span></span>
        `;

        document.getElementById("successModal").classList.add("show");
    });
}