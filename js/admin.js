document.addEventListener("DOMContentLoaded", () => {
    populateAdminProviderFilter();
    renderAdminDashboard();
    renderProviderRoster();

    const providerFilter = document.getElementById("adminProviderFilter");
    if (providerFilter) {
        providerFilter.addEventListener("change", renderAdminDashboard);
    }

    const addProviderForm = document.getElementById("addProviderForm");
    if (addProviderForm) {
        addProviderForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("pName").value.trim();
            const specialty = document.getElementById("pSpecialty").value.trim();
            const experience = document.getElementById("pExperience").value.trim();
            const rating = document.getElementById("pRating").value.trim();
            const icon = document.getElementById("pIcon").value;

            const currentProviders = getStoredProviders();
            const newId = currentProviders.length > 0 ? Math.max(...currentProviders.map(p => p.id)) + 1 : 1;

            const newProvider = {
                id: newId,
                name: name,
                specialty: specialty,
                experience: experience,
                rating: rating || "4.8",
                icon: icon || "💼",
                email: name.toLowerCase().replace(/[^a-z0-9]/g, "") + "@provider.com"
            };

            currentProviders.push(newProvider);
            saveStoredProviders(currentProviders);

            alert(`Service Provider ${name} registered successfully!`);
            addProviderForm.reset();
            populateAdminProviderFilter();
            renderProviderRoster();
        });
    }
});

function populateAdminProviderFilter() {
    const filterSelect = document.getElementById("adminProviderFilter");
    if (!filterSelect) return;

    const currentProviders = getStoredProviders();
    const currentVal = filterSelect.value || "ALL";

    filterSelect.innerHTML = '<option value="ALL">All Service Providers</option>';
    currentProviders.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.name;
        opt.textContent = `${p.icon || '💼'} ${p.name} (${p.specialty})`;
        filterSelect.appendChild(opt);
    });

    filterSelect.value = currentVal;
}

function renderAdminDashboard() {
    const currentAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const currentUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const currentProviders = getStoredProviders();

    document.getElementById("userCount").textContent = currentUsers.length;
    document.getElementById("providerCount").textContent = currentProviders.length;
    document.getElementById("appointmentCount").textContent = currentAppointments.length;

    document.getElementById("confirmedCount").textContent =
        currentAppointments.filter(a => a.status === "Confirmed").length;

    // Detect Time Slot Conflicts per Provider
    const providerSlotCounts = {};
    currentAppointments.forEach(app => {
        if (app.status !== "Cancelled") {
            const key = `${app.provider}_${app.date}_${app.time}`;
            providerSlotCounts[key] = (providerSlotCounts[key] || 0) + 1;
        }
    });

    let totalConflicts = 0;
    Object.values(providerSlotCounts).forEach(c => {
        if (c > 1) totalConflicts += c;
    });

    const conflictCountEl = document.getElementById("adminConflictCount");
    if (conflictCountEl) conflictCountEl.textContent = totalConflicts;

    const conflictStatCard = document.getElementById("adminConflictStatCard");
    if (conflictStatCard) {
        if (totalConflicts > 0) {
            conflictStatCard.style.border = "1.5px solid #f59e0b";
            conflictStatCard.style.background = "#fffbeb";
        } else {
            conflictStatCard.style.border = "1px solid var(--border)";
            conflictStatCard.style.background = "var(--surface)";
        }
    }

    const table = document.getElementById("adminAppointments");
    if (!table) return;

    const filterVal = document.getElementById("adminProviderFilter") ? document.getElementById("adminProviderFilter").value : "ALL";
    
    const filteredAppointments = filterVal === "ALL" 
        ? currentAppointments 
        : currentAppointments.filter(a => a.provider && a.provider.toLowerCase().includes(filterVal.toLowerCase()));

    if (filteredAppointments.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: var(--muted); padding: 30px;">No appointments found for this selection.</td>
            </tr>
        `;
    } else {
        table.innerHTML = "";
        filteredAppointments.forEach(appointment => {
            const slotKey = `${appointment.provider}_${appointment.date}_${appointment.time}`;
            const hasConflict = appointment.status !== "Cancelled" && (providerSlotCounts[slotKey] > 1);

            const isPending = appointment.status === "Pending";
            const isConfirmed = appointment.status === "Confirmed";

            table.innerHTML += `
                <tr style="${hasConflict ? 'background: #fff7ed;' : ''}">
                    <td><strong>${appointment.id}</strong></td>
                    <td>${appointment.userEmail || "Guest"}</td>
                    <td><strong>${appointment.provider}</strong></td>
                    <td>${appointment.date} at ${appointment.time}</td>
                    <td>
                        <span class="status ${appointment.status.toLowerCase()}">
                            ${appointment.status}
                        </span>
                    </td>
                    <td>
                        ${hasConflict 
                            ? `<span style="background: #fef3c7; color: #b45309; border: 1px solid #fde68a; padding: 4px 10px; border-radius: 9999px; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">⚠️ Time Conflict (${providerSlotCounts[slotKey]} bookings)</span>` 
                            : `<span style="color: #16a34a; font-size: 13px; font-weight: 600;">✓ Normal</span>`}
                    </td>
                    <td>
                        <div style="display: flex; gap: 8px;">
                            ${isPending ? `<button class="btn primary" style="padding: 6px 14px; font-size: 13px;" onclick="updateStatus('${appointment.id}', 'Confirmed')">✓ Accept</button>` : ""}
                            ${(isPending || isConfirmed) ? `<button class="btn danger" style="padding: 6px 14px; font-size: 13px;" onclick="updateStatus('${appointment.id}', 'Cancelled')">❌ Cancel</button>` : `<span style="color: var(--muted); font-size: 13px;">No action</span>`}
                        </div>
                    </td>
                </tr>
            `;
        });
    }
}

function updateStatus(id, newStatus) {
    let allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    allAppointments = allAppointments.map(app => app.id === id ? { ...app, status: newStatus } : app);
    localStorage.setItem("appointments", JSON.stringify(allAppointments));
    renderAdminDashboard();
}

function renderProviderRoster() {
    const table = document.getElementById("adminProviderList");
    if (!table) return;

    const currentProviders = getStoredProviders();
    document.getElementById("providerCount").textContent = currentProviders.length;

    if (currentProviders.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--muted); padding: 30px;">No service providers registered yet.</td>
            </tr>
        `;
    } else {
        table.innerHTML = "";
        currentProviders.forEach(p => {
            table.innerHTML += `
                <tr>
                    <td style="font-size: 26px;">${p.icon || '💼'}</td>
                    <td><strong>${p.name}</strong></td>
                    <td><span class="specialty" style="margin:0;">${p.specialty}</span></td>
                    <td>${p.experience}</td>
                    <td>⭐ ${p.rating}</td>
                    <td>
                        <button class="btn danger" style="padding: 6px 14px; font-size: 13px;" onclick="removeProvider(${p.id})">
                            🗑️ Remove
                        </button>
                    </td>
                </tr>
            `;
        });
    }
}

function removeProvider(id) {
    if (!confirm("Are you sure you want to remove this service provider?")) return;

    let currentProviders = getStoredProviders();
    currentProviders = currentProviders.filter(p => p.id !== id);
    saveStoredProviders(currentProviders);
    populateAdminProviderFilter();
    renderProviderRoster();
}