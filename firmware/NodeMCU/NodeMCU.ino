#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <Wire.h>

// WIFI Creadentials
const char* ssid = "Home WIFI";
const char* password = "infinity@1";
const char* user = "user3";
// Sensor Address
const int MPU = 0x68;

// Server Details
const char* serverName = "http://192.168.101.6:4000/send_data";


// Update Frequency
unsigned long lastTime = 0;
unsigned long timerDelay = 2000; // 5min interval

// Sensor Deatils
const String sensor_name = "MPU_2";
const String type = "MPU6050";
const String location = "GreenHouse";

void setup() {
  // Initialize Serial Communication
  Serial.begin(115200);

  // Initialize the MPU6050 module
  Wire.begin();
  Wire.beginTransmission(MPU);
  Wire.write(0x6B);
  Wire.write(0);
  Wire.endTransmission(true);

  // Initialize Wifi Connection
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP()); 
}

void loop() {
  // Send Post Request at specified time intervals
  if ((millis() - lastTime) > timerDelay) {
    
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      WiFiClient client;
      HTTPClient http;
      // initiate http instance
      http.begin(client, serverName);

      // Fetch Data from the Sensor
      Wire.beginTransmission(MPU);
      Wire.write(0x41);
      Wire.endTransmission(false);
      Wire.requestFrom(MPU, 2, true);

      int16_t raw_temp = Wire.read() << 8 | Wire.read();
      double temp = (raw_temp/340) + 36.53;

      http.addHeader("Content-Type", "application/json");
      // String json_data = String("{\"Data\":\"Temperature\",\"sensor\":\"BME280\",\"temp\":\"") +String("\"}");
      String json_data = String("{\"Data\":\"Temperature\",\"sensor_name\":\"") + sensor_name + String("\",\"location\":\"") + location + String("\",\"temp\":\"") + temp +String("\",\"type\":\"") + type+String("\",\"user\":\"") + user +String("\"}");
      int httpResponseCode = http.POST(json_data);
     
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      
      // Terminate http instance
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}