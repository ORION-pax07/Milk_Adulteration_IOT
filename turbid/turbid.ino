// #include <WiFi.h>
// #include <FirebaseESP32.h>

// // === WiFi Credentials ===
// #define WIFI_SSID "Mi_10i"
// #define WIFI_PASSWORD "azgw12345"

// // === Firebase Credentials ===
// #define FIREBASE_HOST "https://milkqualityproject-default-rtdb.asia-southeast1.firebasedatabase.app/"
// #define FIREBASE_AUTH "HeG4fogsRWjnXaQFZNXqRoA3AzuBetUsWGoxUbq4"

// // === Firebase Setup ===
// FirebaseData firebaseData;
// FirebaseAuth auth;
// FirebaseConfig config;

// // === Sensor Pin ===
// #define TDS_PIN 34  // Yellow (AOUT) → GPIO34

// void setup() {
//   Serial.begin(9600);
//   analogReadResolution(12);  // ESP32 ADC resolution is 12 bits (0–4095)

//   // WiFi Connection
//   WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
//   Serial.print("Connecting to Wi-Fi");
//   while (WiFi.status() != WL_CONNECTED) {
//     delay(500);
//     Serial.print(".");
//   }
//   Serial.println("\n✅ WiFi connected");

//   // Firebase Connection
//   config.database_url = FIREBASE_HOST;
//   config.signer.tokens.legacy_token = FIREBASE_AUTH;
//   Firebase.begin(&config, &auth);
//   Firebase.reconnectWiFi(true);
//   Serial.println("✅ Firebase connected");
// }

// void loop() {
//   int analogValue = getAverageTDS();
//   float voltage = analogValue * (3.3 / 4095.0);

//   // Classify based on MILK thresholds
//   String status = (analogValue > 2500) ? "Clear Milk" : "Contaminated Milk";

//   // Serial Debug
//   Serial.print("Analog Value: ");
//   Serial.print(analogValue);
//   Serial.print(" | Voltage: ");
//   Serial.print(voltage, 2);
//   Serial.print(" V | Status: ");
//   Serial.println(status);

//   // Upload to Firebase
//   bool uploaded = true;
//   uploaded &= Firebase.setInt(firebaseData, "/milk/turbidity/value", analogValue);
//   uploaded &= Firebase.setFloat(firebaseData, "/milk/turbidity/voltage", voltage);
//   uploaded &= Firebase.setString(firebaseData, "/milk/turbidity/status", status);

//   if (uploaded) {
//     Serial.println("✅ Uploaded analog, voltage, and status to Firebase");
//   } else {
//     Serial.print("❌ Upload Failed: ");
//     Serial.println(firebaseData.errorReason());
//   }

//   delay(2000);
// }

// int getAverageTDS() {
//   int total = 0;
//   const int samples = 10;
//   for (int i = 0; i < samples; i++) {
//     total += analogRead(TDS_PIN);
//     delay(10);
//   }
//   return total / samples;
// }





#include <WiFi.h>
#include <FirebaseESP32.h>

// === WiFi Credentials ===
#define WIFI_SSID "Mi_10i"
#define WIFI_PASSWORD "azgw12345"

// === Firebase Credentials ===
#define FIREBASE_HOST "https://milkqualityproject-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define FIREBASE_AUTH "HeG4fogsRWjnXaQFZNXqRoA3AzuBetUsWGoxUbq4"

// === Firebase Setup ===
FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

// === Sensor Pin ===
#define TDS_PIN 34

String inputBuffer = "";
String sampleType = "";
bool active = false;

void setup() {
  Serial.begin(9600);
  analogReadResolution(12);  // 12-bit ADC (0–4095)

  // WiFi Setup
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi connected");

  // Firebase Setup
  config.database_url = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  Serial.println("✅ Firebase connected");

  Serial.println("Enter sample type: turmeric, coffee, milk, or water");
}

void loop() {
  // --- Serial Input Handling ---
  if (Serial.available()) {
    char ch = Serial.read();
    if (ch == '\n' || ch == '\r') {
      if (inputBuffer.length() > 0) {
        sampleType = inputBuffer;
        sampleType.trim();
        sampleType.toLowerCase();
        active = true;
        inputBuffer = "";
        Serial.print("🧪 Sample set to: ");
        Serial.println(sampleType);
      }
    } else {
      inputBuffer += ch;
    }
  }

  if (active) {
    int analogValue = getSimulatedTurbidity(sampleType);
    float voltage = analogValue * (3.3 / 4095.0);
    String status = classifyTurbidity(analogValue);

    Serial.print("Analog: ");
    Serial.print(analogValue);
    Serial.print(" | Voltage: ");
    Serial.print(voltage, 3);
    Serial.print(" V | Status: ");
    Serial.println(status);

    // Upload to Firebase
    bool uploaded = true;
    uploaded &= Firebase.setInt(firebaseData, "/milk/turbidity/value", analogValue);
    uploaded &= Firebase.setFloat(firebaseData, "/milk/turbidity/voltage", voltage);
    uploaded &= Firebase.setString(firebaseData, "/milk/turbidity/status", status);

    if (uploaded) {
      Serial.println("✅ Uploaded to Firebase");
    } else {
      Serial.print("❌ Upload failed: ");
      Serial.println(firebaseData.errorReason());
    }

    delay(2000);
  }
}

// --- Generate Simulated Analog Values Based on Sample Keyword ---
int getSimulatedTurbidity(String sample) {
  if (sample == "turmeric") {
    return random(1500, 2001);
  } else if (sample == "coffee") {
    return random(600, 1501);
  } else if (sample == "milk") {
    return random(2500, 2801);
  } else if (sample == "water") {
    return random(2801, 3600);
  } else {
    Serial.println("❌ Invalid input! Please type: turmeric, coffee, milk, or water");
    active = false;
    return 0;
  }
}

// --- Classify Based on Analog Value Threshold ---
String classifyTurbidity(int value) {
  if (value > 2500  && value < 2800) {
    return "Clear Milk";
  }
  else if (value > 2800) {
    return " Milk with added water";
  }
  else {
    return "Contaminated Milk";
  }
}
