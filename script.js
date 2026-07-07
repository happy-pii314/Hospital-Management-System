const form = document.getElementById("patientForm");
const table = document.getElementById("patientTable");
const totalPatients = document.getElementById("totalPatients");
const search = document.getElementById("search");

const patientId = document.getElementById("patientId");
const patientName = document.getElementById("patientName");
const age = document.getElementById("age");
const gender = document.getElementById("gender");
const bloodGroup = document.getElementById("bloodGroup");
const disease = document.getElementById("disease");
const doctorName = document.getElementById("doctorName");
const mobile = document.getElementById("mobile");
const admitDate = document.getElementById("admitDate");

const doctors = {

    "Fever":[
        "Dr. Vivek Sharma (General Physician)",
        "Dr. Rohan Patel (General Physician)"],
    "Dengue":["Dr. Vivek Sharma (General Physician)"],
    "Malaria":["Dr. Vivek Sharma (General Physician)" ],
    "Typhoid":["Dr. Vivek Sharma (General Physician)"],
    "Diabetes":["Dr. Rajesh Patel (Endocrinologist)"],
    "Asthma":["Dr. Kunal Desai (Pulmonologist)"],
    "Covid-19":["Dr. Kunal Desai (Pulmonologist)"],
    "Heart Disease":["Dr. Rajesh Patel (Cardiologist)"],
    "Skin Allergy":["Dr. Neha Joshi (Dermatologist)"],
    "Fracture":["Dr. Amit Mehta (Orthopedic)"],
    "Kidney Stone":["Dr. Ravi Shah (Urologist)"],
    "Migraine":["Dr. Kunal Desai (Neurologist)"],
    "Food Poisoning":["Dr. Vivek Sharma (General Physician)"],
    "Pneumonia":["Dr. Kunal Desai (Pulmonologist)"],
    "Eye Infection":["Dr. Sneha Kapoor (Ophthalmologist)"]
};
let patients = [];
loadPatients();

async function loadPatients(){
    const response = await fetch("api.php");
    patients = await response.json();
    displayPatients(patients);
}
function displayPatients(data){

    table.innerHTML="";
    totalPatients.innerHTML=data.length;
    data.forEach(patient=>{

        table.innerHTML +=`
        <tr>
        <td>${patient.patient_id}</td>
        <td>${patient.patient_name}</td>
        <td>${patient.age}</td>
        <td>${patient.gender}</td>
        <td>${patient.blood_group}</td>
        <td>${patient.disease}</td>
        <td>${patient.doctor_name}</td>
        <td>${patient.mobile}</td>
        <td>${patient.admit_date}</td>
        <td>
        <button class="edit" onclick="editPatient(${patient.patient_id})">Edit</button>
        <button class="delete" onclick="deletePatient(${patient.patient_id})">Delete</button>
        </td>
        </tr>
        `;
    });
}
form.addEventListener("submit",async function(e){

    e.preventDefault();
    const patient={
        patient_name:patientName.value,
        age:age.value,
        gender:gender.value,
        blood_group:bloodGroup.value,
        disease:disease.value,
        doctor_name:doctorName.value,
        mobile:mobile.value,
        admit_date:admitDate.value
    };

    if(patientId.value==""){

        await fetch("api.php",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(patient)
        });
        showToast("Patient Added Successfully");
    }
    else{
        await fetch("api.php?id="+patientId.value,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(patient)
        });
        showToast("Patient Updated Successfully");
    }

    form.reset();
    patientId.value="";
    loadPatients();

});

function editPatient(id){

    const patient = patients.find(p=>p.patient_id==id);

    patientId.value=patient.patient_id;
    patientName.value=patient.patient_name;
    age.value=patient.age;
    gender.value=patient.gender;
    bloodGroup.value=patient.blood_group;
    disease.value=patient.disease;
    doctorName.value=patient.doctor_name;
    mobile.value=patient.mobile;
    admitDate.value=patient.admit_date;

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}

async function deletePatient(id){

    if(confirm("Delete Patient?")){

        await fetch("api.php?id="+id,{
            method:"DELETE"
        });

        showToast("Patient Deleted");
        loadPatients();
    }

}

search.addEventListener("keyup",()=>{

    const value=search.value.toLowerCase();

    const filtered=patients.filter(patient=>
        patient.patient_name.toLowerCase().includes(value) ||
        patient.disease.toLowerCase().includes(value) ||
        patient.doctor_name.toLowerCase().includes(value)

    );

    displayPatients(filtered);

});

function showToast(message){
    const toast=document.createElement("div");
    toast.className="toast";
    toast.innerHTML=message;
    document.body.appendChild(toast);

    setTimeout(()=>{
        toast.remove();
    },2000);
}

disease.addEventListener("change",function(){
    doctorName.innerHTML="<option value=''>Select Doctor</option>";
    if(doctors[this.value]){
        doctors[this.value].forEach(function(doctor){
            doctorName.innerHTML += `
                <option value="${doctor}">
                    ${doctor}
                </option>
            `;
        });
    }
});