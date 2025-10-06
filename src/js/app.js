import { initializeApp } from 'firebase/app';
// app.js
import './auth.js';
import './notes.js';
import { firebaseConfig } from './firebase-config.js';

// Your app code here
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut 
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCXVKEuagqh3OUFnFxB7cOEjrCVppEZwLc",
    authDomain: "acade-x.firebaseapp.com",
    projectId: "acade-x",
    storageBucket: "acade-x.firebasestorage.app",
    messagingSenderId: "941553633007",
    appId: "1:941553633007:web:398f036d60769c397cbd1a",
    measurementId: "G-TPM6Y4R0QR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check user authentication
function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = 'auth.html';
            return;
        }
    });
}

// Initialize the application
function init() {
    console.log("Acade X application initialized.");
    setupEventListeners();
}

// Set up event listeners for user interactions
function setupEventListeners() {
    const createNoteButton = document.getElementById("create-note");
    if (createNoteButton) {
        createNoteButton.addEventListener("click", createNote);
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

// Function to create a new note
function createNote() {
    console.log("Creating a new note...");
}

// Handle logout
async function handleLogout() {
    try {
        await signOut(auth);
        // Redirect handled by onAuthStateChanged
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

// Call the init function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", init);

// Call checkAuth when the page loads
checkAuth();