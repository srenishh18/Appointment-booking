document.addEventListener("DOMContentLoaded", () => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || (currentUser.role !== "provider" && !currentUser.email.toLowerCase().includes("@provider.com"))) {
        // Fallback to default demo provider if user logged in is not provider
        const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
        const demoProv = registeredUsers.find(u => u.role === "provider" || (u.email && u.email.toLowerCase().includes("@provider.com")));
        if (demoProv) {
            currentUser = demoProv;
            localStorage.setItem("currentUser", JSON.stringify(demoProv));
        } else {
            window.location.href = "login.html";
            return;
        }
    }

    const providerHeaderTitle = document.getElementById("providerHeaderTitle");
    const providerHeaderSub = document.getElementById("providerHeaderSub");
    const providerSpecialtyBadge = document.getElementById("providerSpecialtyBadge");

    if (providerHeaderTitle) providerHeaderTitle.textContent = `${currentUser.name}'s Dashboard`;
    if (providerHeaderSub) providerHeaderSub.textContent = `Client appointment requests & schedule overview for ${currentUser.email}`;
    if (providerSpecialtyBadge && currentUser.specialty) providerSpecialtyBadge.textContent = currentUser.specialty;

    renderProviderDashboard();

    const statusFilterSelect = document.getElementById("statusFilterSelect");
    if (statusFilterSelect) {
        statusFilterSelect.addEventListener("change", renderProviderDashboard);
    }
});

function renderProviderDashboard() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;

    const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const providerNameClean = currentUser.name.toLowerCase().replace("dr.", "").trim();

    // Filter appointments matching this provider name or email
    const providerAppointments = allAppointments.filter(app => {
        if (!app || !app.provider) return false;
        const appProvLower = app.provider.toLowerCase();
        return appProvLower.includes(providerNameClean) || (app.providerEmail && app.providerEmail.toLowerCase() === currentUser.email.toLowerCase());
    });

    // Detect Time Conflicts (2+ active appointments sharing exact date and time)
    const activeSlotCounts = {};
    providerAppointments.forEach(app => {
        if (app.status !== "Cancelled") {
            const key = `${app.date}_${app.time}`;
            activeSlotCounts[key] = (activeSlotCounts[key] || 0) + 1;
        }
    });

    // Stats calculations
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = providerAppointments.filter(a => a.status === "Confirmed" && new Date(`${a.date}T00:00:00`) >= today);
    const confirmed = providerAppointments.filter(a => a.status === "Confirmed");
    
    let conflictCount = 0;
    Object.values(activeSlotCounts).forEach(c => {
        if (c > 1) conflictCount += c;
    });

    document.getElementById("providerTotalCount").textContent = providerAppointments.length;
    document.getElementById("providerUpcomingCount").textContent = upcoming.length;
    document.getElementById("providerConfirmedCount").textContent = confirmed.length;
    document.getElementById("providerConflictCount").textContent = conflictCount;

    const conflictCard = document.getElementById("conflictStatCard");
    if (conflictCard) {
        if (conflictCount > 0) {
            conflictCard.style.border = "1.5px solid #f59e0b";
            conflictCard.style.background = "#fffbeb";
        } else {
            conflictCard.style.border = "1px solid var(--border)";
            conflictCard.style.background = "var(--surface)";
        }
    }

    const table = document.getElementById("providerScheduleList");
    if (!table) return;

    const filterVal = document.getElementById("statusFilterSelect") ? document.getElementById("statusFilterSelect").value : "ALL";
    const filteredAppointments = filterVal === "ALL" 
        ? providerAppointments 
        : providerAppointments.filter(a => a.status === filterVal);

    if (filteredAppointments.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--muted); padding: 36px;">No appointments found matching this view.</td>
            </tr>
        `;
        return;
    }

    table.innerHTML = "";
    filteredAppointments.forEach(app => {
        const slotKey = `${app.date}_${app.time}`;
        const hasConflict = app.status !== "Cancelled" && (activeSlotCounts[slotKey] > 1);

        const isPending = app.status === "Pending";
        const isConfirmed = app.status === "Confirmed";

        table.innerHTML += `
            <tr style="${hasConflict ? 'background: #fff7ed;' : ''}">
                <td><strong>${app.id}</strong></td>
                <td>${app.userEmail || "Guest"}</td>
                <td><strong>${app.date}</strong> at ${app.time}</td>
                <td>${app.purpose || "Consultation"}</td>
                <td>
                    <span class="status ${app.status.toLowerCase()}">
                        ${app.status}
                    </span>
                </td>
                <td>
                    ${hasConflict 
                        ? `<span style="background: #fef3c7; color: #b45309; border: 1px solid #fde68a; padding: 4px 10px; border-radius: 9999px; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">⚠️ Time Conflict (${activeSlotCounts[slotKey]} bookings)</span>` 
                        : `<span style="color: #16a34a; font-size: 13px; font-weight: 600;">✓ Slot Available</span>`}
                </td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        ${isPending ? `<button class="btn primary" style="padding: 6px 12px; font-size: 13px;" onclick="providerUpdateStatus('${app.id}', 'Confirmed')">✓ Accept</button>` : ""}
                        ${isConfirmed ? `<button class="btn secondary" style="padding: 6px 12px; font-size: 13px; color: #16a34a; border-color: #86efac;" onclick="providerUpdateStatus('${app.id}', 'Completed')">✓ Complete</button>` : ""}
                        ${(isPending || isConfirmed) ? `<button class="btn danger" style="padding: 6px 12px; font-size: 13px;" onclick="providerUpdateStatus('${app.id}', 'Cancelled')">❌ Cancel</button>` : `<span style="color: var(--muted); font-size: 13px;">No action</span>`}
                    </div>
                </td>
            </tr>
        `;
    });
}

function providerUpdateStatus(id, newStatus) {
    let allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    allAppointments = allAppointments.map(app => app.id === id ? { ...app, status: newStatus } : app);
    localStorage.setItem("appointments", JSON.stringify(allAppointments));
    renderProviderDashboard();
}
