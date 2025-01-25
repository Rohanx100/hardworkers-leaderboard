import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBsznhMKhaQEu1X23zMRMHIdGWFV2zG4tE",
    authDomain: "leaderboard-fd21a.firebaseapp.com",
    projectId: "leaderboard-fd21a",
    storageBucket: "leaderboard-fd21a.firebasestorage.app",
    messagingSenderId: "368135914452",
    appId: "1:368135914452:web:dc936421b6761baf0dcc41",
    measurementId: "G-LN33KP2FR3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore collection reference
const leaderboardCollection = collection(db, "leaderboard");

// Function to toggle rules visibility
window.toggleRules = function () {
    const rulesDiv = document.getElementById("rules");
    rulesDiv.style.display = rulesDiv.style.display === "none" ? "block" : "none";
};

// Function to fetch and display leaderboard
function fetchLeaderboard() {
    const q = query(leaderboardCollection, orderBy("score", "desc"));

    onSnapshot(q, (snapshot) => {
        const leaderboard = document.getElementById("leaderboard");
        leaderboard.innerHTML = ""; // Clear existing entries

        let rank = 1;
        snapshot.forEach((doc) => {
            const data = doc.data();
            const item = document.createElement("li");
            item.textContent = `${rank}. ${data.name} - ${data.score} points`;

            leaderboard.appendChild(item);
            rank++;
        });
    });
}

// Fetch leaderboard on page load
document.addEventListener("DOMContentLoaded", fetchLeaderboard);
