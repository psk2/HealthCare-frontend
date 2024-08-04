import { BASE_URL } from './baseurl.js';
import { fetchAppointments } from './appointments.js';

const patientsList = document.getElementById('patientsList');
const patientForm = document.getElementById('patientForm');
const patientIdField = document.getElementById('patientId');
const patientNameField = document.getElementById('patientName');
const patientAgeField = document.getElementById('patientAge');
const patientGenderField = document.getElementById('patientGender');
const patientConditionField = document.getElementById('patientCondition');

async function fetchPatients() {
	const response = await fetch(`${BASE_URL}/patients`);
	const patients = await response.json();
	patientsList.innerHTML = '';
	patients.forEach(patient => {
		const patientItem = document.createElement('li');
		patientItem.classList.add('list-group-item');
		patientItem.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${patient.name}</h5>
                    <p class="card-text">
                        Age: ${patient.age}<br>
                        Gender: ${patient.gender}<br>
                        Condition: ${patient.condition}
                    </p>
                    <button class="btn btn-primary btn-sm edit-patient" data-id="${patient.id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-patient" data-id="${patient.id}">Delete</button>
                </div>
            </div>
        `;
		patientsList.appendChild(patientItem);
	});
	document.querySelectorAll('.edit-patient').forEach(button => {
		button.addEventListener('click', async (event) => {
			const patientId = event.target.getAttribute('data-id');
			const response = await fetch(`${BASE_URL}/patients/${patientId}`);
			const patient = await response.json();
			patientIdField.value = patient.id;
			patientNameField.value = patient.name;
			patientAgeField.value = patient.age;
			patientGenderField.value = patient.gender;
			patientConditionField.value = patient.condition;
		});
	});
	document.querySelectorAll('.delete-patient').forEach(button => {
		button.addEventListener('click', async (event) => {
			const patientId = event.target.getAttribute('data-id');
			await fetch(`${BASE_URL}/patients/${patientId}`, { method: 'DELETE' });
			fetchPatients();
			fetchAppointments();
		});
	});
}

patientForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	const patient = {
		name: patientNameField.value,
		age: parseInt(patientAgeField.value),
		gender: patientGenderField.value,
		condition: patientConditionField.value,
	};
	if (patientIdField.value) {
		await fetch(`${BASE_URL}/patients/${patientIdField.value}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(patient),
		});
	} else {
		await fetch(`${BASE_URL}/patients`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(patient),
		});
	}
	patientForm.reset();
	fetchPatients();
	fetchAppointments();
});

fetchPatients();
