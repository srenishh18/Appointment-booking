const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        window.location.href = "login.html";
    }

    const dateInput = document.getElementById("date");
    const providerId = Number(new URLSearchParams(window.location.search).get("provider"));

    if (providerId > 0 && providerId < document.getElementById("provider").options.length) {
        document.getElementById("provider").selectedIndex = providerId;
    }

    // Prevent selecting previous dates
    const today = new Date();

    const year = today.getFullYear();

    const month =
        String(today.getMonth() + 1).padStart(2, "0");

    const day =
        String(today.getDate()).padStart(2, "0");

    dateInput.min = `${year}-${month}-${day}`;


    bookingForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const provider =
            document.getElementById("provider").value;

        const date =
            document.getElementById("date").value;

        const time =
            document.getElementById("time").value;

        const purpose =
            document.getElementById("purpose").value;

        const appointment = {

            id:
                "APT" +
                Math.floor(
                    1000 + Math.random() * 9000
                ),

            provider: provider,

            date: date,

            time: time,

            purpose: purpose,

            userEmail: currentUser.email,

            status: "Confirmed",

            createdAt:
                new Date().toISOString()

        };


        let appointments =
            JSON.parse(
                localStorage.getItem("appointments")
            ) || [];


        appointments.push(appointment);


        localStorage.setItem(
            "appointments",
            JSON.stringify(appointments)
        );


        document.getElementById("appointmentDetails").innerHTML = `
            <span class="confirmation-row"><strong>Appointment ID</strong><span>${appointment.id}</span></span>
            <span class="confirmation-row"><strong>Provider</strong><span>${provider}</span></span>
            <span class="confirmation-row"><strong>Date</strong><span>${date}</span></span>
            <span class="confirmation-row"><strong>Time</strong><span>${time}</span></span>
            <span class="confirmation-row"><strong>Status</strong><span class="status confirmed">Confirmed</span></span>
        `;


        document
            .getElementById("successModal")
            .classList.add("show");

    });

}