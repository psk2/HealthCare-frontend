import { BASE_URL } from './baseurl.js';
import { fetchAppointments } from './appointments.js';

const doctorsList = document.getElementById('doctorsList');
const doctorForm = document.getElementById('doctorForm');
const doctorIdField = document.getElementById('doctorId');
const doctorNameField = document.getElementById('doctorName');
const doctorSpecialtyField = document.getElementById('doctorSpecialty');

async function fetchDoctors() {
	const response = await fetch(`${BASE_URL}/doctors`);
	const doctors = await response.json();
	doctorsList.innerHTML = '';
	doctors.forEach(doctor => {
		const doctorItem = document.createElement('li');
		doctorItem.classList.add('list-group-item');
		doctorItem.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${doctor.name}</h5>
                    <p class="card-text">
                        Specialty: ${doctor.specialization}
                    </p>
                    <button class="btn btn-primary btn-sm edit-doctor" data-id="${doctor.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-doctor" data-id="${doctor.id}">Delete</button>
                </div>
            </div>
        `;
		doctorsList.appendChild(doctorItem);
	});
	document.querySelectorAll('.edit-doctor').forEach(button => {
		button.addEventListener('click', async (event) => {
			const doctorId = event.target.getAttribute('data-id');
			const response = await fetch(`${BASE_URL}/doctors/${doctorId}`);
			const doctor = await response.json();
			doctorIdField.value = doctor.id;
			doctorNameField.value = doctor.name;
			doctorSpecialtyField.value = doctor.specialization;
		});
	});
	document.querySelectorAll('.delete-doctor').forEach(button => {
		button.addEventListener('click', async (event) => {
			const doctorId = event.target.getAttribute('data-id');
			await fetch(`${BASE_URL}/doctors/${doctorId}`, { method: 'DELETE' });
			fetchDoctors();
			fetchAppointments();
		});
	});
}

doctorForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	const doctor = {
		name: doctorNameField.value,
		specialization: doctorSpecialtyField.value,
	};
	if (doctorIdField.value) {
		await fetch(`${BASE_URL}/doctors/${doctorIdField.value}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(doctor),
		});
	} else {
		await fetch(`${BASE_URL}/doctors`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(doctor),
		});
	}
	doctorForm.reset();
	fetchDoctors();
	fetchAppointments();
});

fetchDoctors();
