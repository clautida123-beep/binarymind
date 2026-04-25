#include <Arduino.h>
#include <SPI.h>

// Définition des pins standards ESP32
#define SCK_PIN  18
#define MISO_PIN 19
#define MOSI_PIN 23
#define SS_PIN   5
#define RST_PIN  22

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n--- TEST DE CONNECTIVITÉ SPI ---");

  // Initialisation manuelle du bus SPI
  SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN, SS_PIN);
  
  pinMode(RST_PIN, OUTPUT);
  digitalWrite(RST_PIN, HIGH); // Réveille le module
  delay(50);

  pinMode(SS_PIN, OUTPUT);
  digitalWrite(SS_PIN, HIGH);
}

void loop() {
  byte version;
  
  // On essaie de lire le registre 0x37 (VersionReg sur MFRC522)
  digitalWrite(SS_PIN, LOW);
  SPI.transfer(0x37 << 1 | 0x80); // Adresse de lecture
  version = SPI.transfer(0x00);    // Lecture de la réponse
  digitalWrite(SS_PIN, HIGH);

  Serial.print("Réponse du module (HEX) : 0x");
  if (version < 0x10) Serial.print("0");
  Serial.println(version, HEX);

  if (version == 0x00 || version == 0xFF) {
    Serial.println("ERREUR : Aucune réponse du module. Vérifiez le câblage.");
  } else {
    Serial.println("SUCCÈS : Le module répond !");
  }

  delay(2000);
}