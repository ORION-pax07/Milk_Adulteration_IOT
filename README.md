# 🥛 Milk Adulteration Detection using ESP32

This project detects milk adulteration using **pH** and **turbidity sensors**, powered by an **ESP32** microcontroller. It uploads real-time data to **Firebase Realtime Database** and also displays the results on a **local web dashboard**.

---

## 📦 Features

- 📶 ESP32-based sensor integration
- 📈 pH and turbidity measurement
- ☁️ Firebase Realtime Database integration
- 🌐 Local web server (Flask/Node.js) for dashboard
- 🚨 Adulteration alerts based on threshold values

---

## 🔌 Hardware Components

- ESP32 Dev Board  
- pH Sensor Module  
- Turbidity Sensor Module  
- Jumper Wires, Breadboard, USB Cable

---

## 🧪 Parameters Measured

| Parameter | Normal Range | Possible Adulteration If... |
|----------|---------------|------------------------------|
| pH       | 6.5 - 6.8     | <6.4 or >6.9 (detergents, neutralizers) |
| Turbidity | ~1.5 - 2.0V (ADC) | Too high or low indicates starch, chalk powder, etc. |

---

## 🛠️ How It Works

1. ESP32 reads pH and turbidity data
2. Data is:
   - Sent to Firebase
   - Displayed on a local web dashboard
3. Alerts are triggered if values go beyond safe range

---

## 📂 Folder Structure

