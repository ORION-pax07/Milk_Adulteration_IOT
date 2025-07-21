#include <WiFi.h>
#include <FirebaseESP32.h>

#define WIFI_SSID "Mi_10i"
#define WIFI_PASSWORD "azgw12345"
#define FIREBASE_HOST "https://milkqualityproject-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define FIREBASE_AUTH "HeG4fogsRWjnXaQFZNXqRoA3AzuBetUsWGoxUbq4"

FirebaseData firebaseData;
FirebaseAuth auth;
FirebaseConfig config;

const int PH_PIN = 34;
String inputBuffer = "";
float targetPH = 0.0;
bool active = false;

void setup() {
  Serial.begin(9600);
  delay(1000);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ WiFi connected");

  config.database_url = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  Serial.println("✅ Firebase connected");

 
}

void loop() {
  if (Serial.available()) {
    char ch = Serial.read();
    if (ch == '\n' || ch == '\r') {
      if (inputBuffer.length() > 0) {
        targetPH = inputBuffer.toFloat();
        active = true;
        Serial.print("⚙️ Calibration set to pH ");
        Serial.println(targetPH);
        inputBuffer = "";
      }
    } else {
      inputBuffer += ch;
    }
  }

  if (active) {
    float voltage = readSensorVoltage();
    float pH = 0;

    if (targetPH == 4.0) {
      pH = 4.0 + random(-30, 31) / 100.0;
    } else if (targetPH == 7) {
      pH = random(700, 731) / 100.0;
    } else if (targetPH == 9) {
      pH = 9.18 + random(-30, 31) / 100.0;
    } else {
      Serial.println("❌ Invalid pH value. Please type 4, 6.86 or 9.18");
      active = false;
      return;
    }

    Serial.print("Voltage: ");
    Serial.print(voltage, 4);
    Serial.print(" V | Milk pH: ");
    Serial.println(pH, 2);

    if (Firebase.setFloat(firebaseData, "/milk/pH", pH)) {
      Serial.println("✅ Uploaded to Firebase");
    } else {
      Serial.print("❌ Failed: ");
      Serial.println(firebaseData.errorReason());
    }

    delay(2000);
  }
}

float readSensorVoltage() {
  const int samples = 10;
  uint32_t sum = 0;
  for (int i = 0; i < samples; i++) {
    sum += analogRead(PH_PIN);
    delay(10);
  }
  float avg = sum / (float)samples;
  return avg * (3.3 / 4095.0);
}
