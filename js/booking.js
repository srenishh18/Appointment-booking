const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {

    const dateInput = document.getElementById("date");

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


        document.getElementById(
            "appointmentDetails"
        ).innerHTML = `

            <strong>${provider}</strong><br><br>

            Date: ${date}<br>

            Time: ${time}<br>

            Appointment ID: ${appointment.id}

        `;


        document
            .getElementById("successModal")
            .classList.add("show");

    });

}