const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./binarymind.sqlite');

app.use(cors());
app.use(express.json());
// On sert les fichiers du frontend (le zip que tu as extrait)
app.use(express.static(path.join(__dirname, '../binarymind-master')));

// ROUTE DE LOGIN (Logique métier)
app.post('/api/login', (req, res) => {
    const { role, password } = req.body;
    
    db.get("SELECT * FROM users WHERE role = ? AND password = ?", [role, password], (err, user) => {
        if (err) return res.status(500).json({ error: "Erreur DB" });
        if (user) {
            res.json({ success: true, message: `Bienvenue ${user.username}`, extension: user.sip_extension });
        } else {
            res.status(401).json({ success: false, message: "Identifiants incorrects" });
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 BinaryMind Backend lancé sur http://localhost:${PORT}`);
});
