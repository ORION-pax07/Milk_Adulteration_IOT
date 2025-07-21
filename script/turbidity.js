// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
// import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

// // Firebase Config
// const firebaseConfig = {
//   apiKey: "AIzaSyBGXj_1N1UnK1HVeIfvn36AaYHHY2Oyuu0",
//   authDomain: "milkqualityproject.firebaseapp.com",
//   databaseURL: "https://milkqualityproject-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "milkqualityproject",
//   storageBucket: "milkqualityproject.firebasestorage.app",
//   messagingSenderId: "1090116065545",
//   appId: "1:1090116065545:web:3be830725f60029c2fdbd8",
//   measurementId: "G-1CS4XHNG12"
// };

// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);

// // DOM Elements
// const turbidityValue = document.getElementById("turbidityValue");
// const turbidityStatus = document.getElementById("turbidityStatus");
// const showLiveBtn = document.getElementById("showLiveBtn");
// const loading = document.getElementById("loading");
// const avgOutput = document.getElementById("avgOutput");
// const recalcBtn = document.getElementById("recalculateBtn");

// let turbidityReadings = [];

// // === Live Display Function ===
// function fetchLiveTurbidity() {
//   const turbRef = ref(db, "milk/turbidity/value");
//   onValue(turbRef, (snapshot) => {
//     const val = snapshot.val();
//     turbidityValue.innerText = val;
//     turbidityReadings.push(val);

//     // Display status message
//     if (val > 3500) {
//       turbidityStatus.innerText = "Clean Water (Good Clarity)";
//       turbidityStatus.style.color = "green";
//     } else if (val >= 1000) {
//       turbidityStatus.innerText = "Moderately Turbid (Check quality)";
//       turbidityStatus.style.color = "orange";
//     } else {
//       turbidityStatus.innerText = "Highly Turbid / Contaminated";
//       turbidityStatus.style.color = "red";
//     }

//     if (turbidityReadings.length > 20) turbidityReadings.shift();
//   });
// }

// // === Average Calculation ===
// function calculateAverage() {
//   loading.classList.remove("hidden");
//   avgOutput.classList.add("hidden");

//   let count = 0;
//   const tempReadings = [];

//   const unsubscribe = onValue(ref(db, "milk/turbidity/value"), (snapshot) => {
//     const val = snapshot.val();
//     if (!isNaN(val)) {
//       tempReadings.push(val);
//       count++;

//       if (count === 10) {
//         unsubscribe();  // stop after 10 values
//         showAverage(tempReadings);
//       }
//     }
//   });
// }

// // === Display Average Results ===
// function showAverage(readings) {
//   const total = readings.reduce((a, b) => a + b, 0);
//   const avg = total / readings.length;

//   let html = `<strong>✅ Average of 10 Turbidity readings:</strong><br>`;
//   html += readings.map((v, i) => `Turbidity${i + 1}: ${v}`).join("<br>");
//   html += `<br><strong>📊 Average Turbidity:</strong> ${avg.toFixed(2)}`;

//   avgOutput.innerHTML = html;
//   loading.classList.add("hidden");
//   avgOutput.classList.remove("hidden");

//   // Enable recalculate button
//   recalcBtn.disabled = false;
//   recalcBtn.classList.remove("disabled");
// }

// // === Events ===
// showLiveBtn.addEventListener("click", () => {
//   fetchLiveTurbidity();
//   calculateAverage();
// });

// recalcBtn.addEventListener("click", () => {
//   recalcBtn.disabled = true;
//   recalcBtn.classList.add("disabled");
//   calculateAverage();
// });




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
const turbidityValue = document.getElementById("turbidityValue");
const turbidityStatus = document.getElementById("turbidityStatus");
const showLiveBtn = document.getElementById("showLiveBtn");
const loading = document.getElementById("loading");
const avgOutput = document.getElementById("avgOutput");
const recalcBtn = document.getElementById("recalculateBtn");

let turbidityReadings = [];

function fetchLiveTurbidity() {
  const turbRef = ref(db, "milk/turbidity/value");
  onValue(turbRef, (snapshot) => {
    const val = snapshot.val();
    turbidityValue.innerText = val;
    turbidityReadings.push(val);

    // 💡 Based on new milk-specific classification:
    if (val > 2500) {
      turbidityStatus.innerText = "✅ Clear Milk (No contamination)";
      turbidityStatus.style.color = "green";
    } else {
      turbidityStatus.innerText = "❌ Contaminated Milk";
      turbidityStatus.style.color = "red";
    }

    if (turbidityReadings.length > 20) turbidityReadings.shift();
  });
}

function calculateAverage() {
  loading.classList.remove("hidden");
  avgOutput.classList.add("hidden");

  let count = 0;
  const tempReadings = [];

  const unsubscribe = onValue(ref(db, "milk/turbidity/value"), (snapshot) => {
    const val = snapshot.val();
    if (!isNaN(val)) {
      tempReadings.push(val);
      count++;

      if (count === 10) {
        unsubscribe();
        showAverage(tempReadings);
      }
    }
  });
}

function showAverage(readings) {
  const total = readings.reduce((a, b) => a + b, 0);
  const avg = total / readings.length;

  let html = `<strong>✅ Average of 10 Turbidity readings:</strong><br>`;
  html += readings.map((v, i) => `Turbidity${i + 1}: ${v}`).join("<br>");
  html += `<br><strong>📊 Average Turbidity:</strong> ${avg.toFixed(2)}<br>`;

  html += (avg > 2500)
    ? `<span style="color:green;">Result: Clear Milk</span>`
    : `<span style="color:red;">Result: Contaminated Milk</span>`;

  avgOutput.innerHTML = html;
  loading.classList.add("hidden");
  avgOutput.classList.remove("hidden");

  recalcBtn.disabled = false;
  recalcBtn.classList.remove("disabled");
}

showLiveBtn.addEventListener("click", () => {
  fetchLiveTurbidity();
  calculateAverage();
});

recalcBtn.addEventListener("click", () => {
  recalcBtn.disabled = true;
  recalcBtn.classList.add("disabled");
  calculateAverage();
});
