const appointments =
    JSON.parse(
        localStorage.getItem("appointments")
    ) || [];


const users =
    JSON.parse(
        localStorage.getItem("registeredUser")
    );


document.getElementById(
    "userCount"
).textContent = users ? 1 : 0;


document.getElementById(
    "appointmentCount"
).textContent =
    appointments.length;


document.getElementById(
    "confirmedCount"
).textContent =
    appointments.filter(
        appointment =>
            appointment.status === "Confirmed"
    ).length;


document.getElementById(
    "cancelledCount"
).textContent =
    appointments.filter(
        appointment =>
            appointment.status === "Cancelled"
    ).length;


const table =
    document.getElementById("adminAppointments");


if (appointments.length === 0) {

    table.innerHTML = `

        <tr>
            <td colspan="5">
                No appointments available.
            </td>
        </tr>

    `;

} else {

    appointments.forEach(appointment => {

        table.innerHTML += `

            <tr>

                <td>
                    ${appointment.id}
                </td>

                <td>
                    ${appointment.provider}
                </td>

                <td>
                    ${appointment.date}
                </td>

                <td>
                    ${appointment.time}
                </td>

                <td>

                    <span class="status
                        ${appointment.status.toLowerCase()}">

                        ${appointment.status}

                    </span>

                </td>

            </tr>

        `;

    });

}