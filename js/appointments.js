import { BASE_URL } from './baseurl.js';

const appointmentsList = document.getElementById('appointmentsList');
const appointmentForm = document.getElementById('appointmentForm');
const appointmentIdField = document.getElementById('appointmentId');
const appointmentPatientField = document.getElementById('appointmentPatient');
const appointmentDoctorField = document.getElementById('appointmentDoctor');
const appointmentDateTimeField = document.getElementById('appointmentDateTime');

export async function fetchAppointments() {
	const response = await fetch(`${BASE_URL}/appointments`);
	const appointments = await response.json();
	appointmentsList.innerHTML = '';
	appointments.forEach(appointment => {
		const appointmentItem = document.createElement('li');
		appointmentItem.classList.add('list-group-item');
		appointmentItem.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${appointment.patient.name} - ${appointment.doctor.name}</h5>
                    <p class="card-text">
                        Date and Time: ${appointment.appointmentDateTime.replace('T', ' ')}
                    </p>
                    <button class="btn btn-danger btn-sm delete-appointment" data-id="${appointment.id}">Delete</button>
                </div>
            </div>
        `;
		appointmentsList.appendChild(appointmentItem);
	});
	document.querySelectorAll('.delete-appointment').forEach(button => {
		button.addEventListener('click', async (event) => {
			const appointmentId = event.target.getAttribute('data-id');
			await fetch(`${BASE_URL}/appointments/${appointmentId}`, { method: 'DELETE' });
			fetchAppointments();
		});
	});
}

appointmentForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	const appointment = {
		patient: { id: parseInt(appointmentPatientField.value) },
		doctor: { id: parseInt(appointmentDoctorField.value) },
		appointmentDateTime: appointmentDateTimeField.value,
	};
	if (appointmentIdField.value) {
		await fetch(`${BASE_URL}/appointments/${appointmentIdField.value}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(appointment),
		});
	} else {
		await fetch(`${BASE_URL}/appointments`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(appointment),
		});
	}
	appointmentForm.reset();
	fetchAppointments();
});

async function loadPatientsAndDoctors() {
	const patientsResponse = await fetch(`${BASE_URL}/patients`);
	const patients = await patientsResponse.json();
	appointmentPatientField.innerHTML = '<option value="">Select Patient</option>';
	patients.forEach(patient => {
		const option = document.createElement('option');
		option.value = patient.id;
		option.text = patient.name;
		appointmentPatientField.appendChild(option);
	});

	const doctorsResponse = await fetch(`${BASE_URL}/doctors`);
	const doctors = await doctorsResponse.json();
	appointmentDoctorField.innerHTML = '<option value="">Select Doctor</option>';
	doctors.forEach(doctor => {
		const option = document.createElement('option');
		option.value = doctor.id;
		option.text = doctor.name;
		appointmentDoctorField.appendChild(option);
	});
}

document.getElementById('refreshAppointments').addEventListener('click', () => {
	fetchAppointments();
	loadPatientsAndDoctors();
});

loadPatientsAndDoctors();
fetchAppointments();
