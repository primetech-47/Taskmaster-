// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDxy9WWzCsb1AobR-BWeu4kiJ6ZegUTuIA",
  authDomain: "taskmaster-114dc.firebaseapp.com",
  projectId: "taskmaster-114dc",
  storageBucket: "taskmaster-114dc.appspot.com",
  messagingSenderId: "878309106162",
  appId: "1:878309106162:web:cdde4cda56455483a98b6b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign-Up Functionality
document.getElementById("signup-btn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    alert("Signed Up Successfully");
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

// Login Functionality
document.getElementById("login-btn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("task-section").style.display = "block";
    document.getElementById("user-name").textContent = userCredential.user.email;
    displayTasks();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

// Logout Functionality
document.getElementById("logout-btn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("Logged Out Successfully");
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("task-section").style.display = "none";
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

// Add Task Functionality
document.getElementById("add-task-btn").addEventListener("click", async () => {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-desc").value;
  const deadline = document.getElementById("task-deadline").value;
  const priority = document.getElementById("task-priority").value;

  if (!auth.currentUser) return alert("Please log in first.");

  try {
    await addDoc(collection(db, "tasks"), {
      title,
      description,
      deadline,
      priority,
      userId: auth.currentUser.uid,
    });
    alert("Task Added Successfully");
    displayTasks();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});

// Display Tasks
async function displayTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = ""; // Clear previous tasks

  if (!auth.currentUser) return;

  const q = query(collection(db, "tasks"), where("userId", "==", auth.currentUser.uid));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const task = doc.data();
    taskList.innerHTML += `
      <div>
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Deadline: ${task.deadline}</p>
        <p>Priority: ${task.priority}</p>
      </div>
    `;
  });
}

// Auto-Fetch Tasks on Login
onAuthStateChanged(auth, (user) => {
  if (user) {
    displayTasks();
  }
});
