# 🛒 Smart Supermarket - Module VoIP & IoT

Bienvenue sur la branche `voip`. Ce module gère la communication vocale (Asterisk) 
et sert de passerelle pour le contrôle des 8 récepteurs IoT (ESP32).

## 🚀 Lancement Rapide (Docker)
Pour démarrer l'infrastructure sur votre machine :
1. Assurez-vous d'avoir Docker et Docker-Compose installés.
2. `cd voip`
3. `docker-compose up -d`

## 📞 Configuration Téléphonie
- **Serveur :** localhost (ou IP de la machine)
- **Protocole :** SIP (UDP/5060)
- **Extensions de test :** 101 (Caisse), 100 (Bureau)

## 🛠️ Architecture du Projet
- **/config** : Contient les fichiers de conf Asterisk (`extensions.conf`, `ari.conf`).
- **/sounds** : Déposez vos fichiers .wav pour les messages vocaux ici.
- **/scripts** : Contient la logique Python pour lier la voix aux IoT.

## 🧠 Développeurs : Comment interagir ?
Pour contrôler l'IoT via la voix, nous utilisons l'**API ARI**. 
Le mot de passe pour vos scripts Python est dans `ari.conf`.
