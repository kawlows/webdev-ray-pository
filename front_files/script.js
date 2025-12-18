const API_URL = 'http://localhost:8000/api';

let patients = [];

// add a new patient
document.getElementById('patientForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const email = document.getElementById('email').value;
  
  if (!name || !age || !email) {
    alert('fill in all fields!');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/patients/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        age: parseInt(age),
        email
      })
    });
    
    if (response.ok) {
      const newPatient = await response.json();
      patients.push(newPatient);
      document.getElementById('patientForm').reset();
      displayPatients();
      alert('patient added!');
    }
  } catch (error) {
    console.error('error adding patient:', error);
    alert('couldnt add patient');
  }
});

// get all patients
async function loadPatients() {
  try {
    const response = await fetch(`${API_URL}/patients/`);
    if (response.ok) {
      patients = await response.json();
      displayPatients();
    }
  } catch (error) {
    console.error('error loading patients:', error);
  }
}

// show patients on page
function displayPatients() {
  const patientList = document.getElementById('patientList');
  
  if (!patientList) return;
  
  if (patients.length === 0) {
    patientList.innerHTML = '<p>no patients yet...</p>';
    return;
  }
  
  patientList.innerHTML = patients.map(patient => `
    <div class="patient-item">
      <div class="patient-info">
        <div class="patient-name">${patient.name}</div>
        <div class="patient-details">age: ${patient.age} | email: ${patient.email}</div>
      </div>
      <button class="delete-btn" onclick="deletePatient(${patient.id})">delete</button>
    </div>
  `).join('');
}

// delete a patient
async function deletePatient(patientId) {
  if (!confirm('sure u wanna delete this patient?')) return;
  
  try {
    const response = await fetch(`${API_URL}/patients/${patientId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      patients = patients.filter(p => p.id !== patientId);
      displayPatients();
      alert('patient deleted!');
    }
  } catch (error) {
    console.error('error deleting patient:', error);
    alert('couldnt delete patient');
  }
}

// load patients when page loads
window.addEventListener('load', loadPatients);
