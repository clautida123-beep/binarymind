const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./binarymind.sqlite');

db.serialize(() => {
  // Table des utilisateurs (Lien avec Asterisk)
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT,
    sip_extension TEXT
  )`);

  // Insertion d'un test (le caissier 101)
  const stmt = db.prepare("INSERT OR IGNORE INTO users (username, password, role, sip_extension) VALUES (?, ?, ?, ?)");
  stmt.run("caissier", "1234", "caissier", "101");
  stmt.finalize();

  console.log("✅ Base de données initialisée !");
});

db.close();
