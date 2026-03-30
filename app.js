// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDyHchZ-cMunCm428PivwvV6nKEAYpmDPs",
  authDomain: "my-diary-14567.firebaseapp.com",
  projectId: "my-diary-14567",
  storageBucket: "my-diary-14567.firebasestorage.app",
  messagingSenderId: "929514949228",
  appId: "1:929514949228:web:e697ffab1e11cc0ec66649"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

let data = [];

// 🔐 Login
function login(){
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if(!email || !password){
    alert("Enter email & password");
    return;
  }

  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(()=>{
    document.getElementById("login").style.display="none";
    document.getElementById("app").style.display="block";
    loadData();
  })
  .catch(err=>{
    alert("Login Error: " + err.message);
  });
}

// ➕ Add Entry
async function addEntry(){
  let date = document.getElementById("date").value;
  let note = document.getElementById("note").value;
  let amount = Number(document.getElementById("amount").value);

  if(!date || !note || !amount){
    let error = document.getElementById("error");
    error.innerText = "All fields are required";
    error.style.display = "block";
    return;
  }

  await db.collection("entries").add({
    date,
    note,
    amount,
    created: Date.now()
  });

  document.getElementById("error").style.display = "none";

  clearFields();
  loadData();
}

// 🔄 Load Data
async function loadData(){
  let snapshot = await db.collection("entries").get();

  data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  display(data);
}

// 🖥️ Display
function display(arr){
  let list = document.getElementById("list");
  list.innerHTML = "";

  let total = 0;

  arr.forEach(item=>{
    total += item.amount;

    list.innerHTML += `
      <div class="box">
        <p>${item.date} - ${item.note} - ₹${item.amount}</p>
        <button onclick="deleteItem('${item.id}')">Delete</button>
      </div>
    `;
  });

  document.getElementById("total").innerText = total;
}

// 🔍 Search
function searchData(){
  let text = document.getElementById("search").value.toLowerCase();

  let filtered = data.filter(d =>
    d.note.toLowerCase().includes(text)
  );

  display(filtered);
}

// 🗑️ Delete
async function deleteItem(id){
  await db.collection("entries").doc(id).delete();
  loadData();
}

// 🧹 Clear
function clearFields(){
  document.getElementById("date").value="";
  document.getElementById("note").value="";
  document.getElementById("amount").value="";
}
let sortType = document.getElementById("sort").value;

if(sortType === "new"){
  data.sort((a,b)=>b.created-a.created);
}else{
  data.sort((a,b)=>a.created-b.created);
}