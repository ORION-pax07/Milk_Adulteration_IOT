import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBGXj_1N1UnK1HVeIfvn36AaYHHY2Oyuu0",
  authDomain: "milkqualityproject.firebaseapp.com",
  databaseURL: "https://milkqualityproject-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "milkqualityproject",
  storageBucket: "milkqualityproject.firebasestorage.app",
  messagingSenderId: "1090116065545",
  appId: "1:1090116065545:web:3be830725f60029c2fdbd8",
  measurementId: "G-1CS4XHNG12"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM Elements
const phValue = document.getElementById("phValue");
const showLiveBtn = document.getElementById("showLiveBtn");
const loading = document.getElementById("loading");
const avgOutput = document.getElementById("avgOutput");
const recalcBtn = document.getElementById("recalculateBtn");

let phReadings = [];

// === Function to fetch live pH ===
function fetchLivePH() {
  const pHRef = ref(db, "milk/pH");
  onValue(pHRef, (snapshot) => {
    const val = snapshot.val();
    phValue.innerText = val.toFixed(2);
    phReadings.push(val);

    // Keep only latest 20 readings (to support recalculations)
    if (phReadings.length > 20) {
      phReadings.shift();
    }
  });
}

// === Calculate Average for next 10 readings ===
function calculateAverage() {
  loading.classList.remove("hidden");
  avgOutput.classList.add("hidden");

  let count = 0;
  const tempReadings = [];

  const unsubscribe = onValue(ref(db, "milk/pH"), (snapshot) => {
    const val = snapshot.val();
    if (!isNaN(val)) {
      tempReadings.push(val);
      count++;

      if (count === 10) {
        unsubscribe();  // stop after 10 values
        showAverage(tempReadings);
      }
    }
  });
}

// === Display Average Calculation ===
function showAverage(readings) {
  const total = readings.reduce((a, b) => a + b, 0);
  const avg = total / readings.length;

  let html = `<strong>✅ Average of 10 pH readings:</strong><br>`;
  html += readings.map((v, i) => `pH${i + 1}: ${v.toFixed(2)}`).join("<br>");
  html += `<br><strong>📊 Average pH:</strong> ${avg.toFixed(2)}`;

  avgOutput.innerHTML = html;
  loading.classList.add("hidden");
  avgOutput.classList.remove("hidden");

  // Enable Recalculate
  recalcBtn.disabled = false;
  recalcBtn.classList.remove("disabled");
}

// === Event Listeners ===
showLiveBtn.addEventListener("click", () => {
  fetchLivePH();
  calculateAverage();
});

recalcBtn.addEventListener("click", () => {
  recalcBtn.disabled = true;
  recalcBtn.classList.add("disabled");
  calculateAverage();
});
