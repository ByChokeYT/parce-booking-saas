import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '../database.sqlite');

const db = new sqlite3.Database(DB_PATH);

// Simple password hash (in real app use bcrypt.hash)
// For this demo, assuming the server checks == or specific hash
// server/index.js logic:
// if (user.password_hash.startsWith('$2')) bcrypt... else plain comparison.
// So let's just use plain text 'admin123' for simplicity of this seed script 
// without needing to import bcrypt here (to avoid dev dependency issues if not installed in root)
const ADMIN_PASS = 'admin123';

db.serialize(() => {
    // Check if user exists
    db.get("SELECT id FROM users WHERE email = 'admin@barber.com'", (err, row) => {
        if (!row) {
            console.log("Creating admin user...");
            const stmt = db.prepare("INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)");
            stmt.run("Admin Barber", "admin@barber.com", ADMIN_PASS, "admin");
            stmt.finalize();
            console.log("User 'admin@barber.com' created with password 'admin123'");
        } else {
            console.log("Admin user already exists.");
        }
    });

    // Add some services if empty
    db.get("SELECT id FROM services LIMIT 1", (err, row) => {
        if (!row) {
            console.log("Seeding services...");
            const stmt = db.prepare("INSERT INTO services (name, price, duration_minutes) VALUES (?, ?, ?)");
            stmt.run("Corte Clásico", 15.00, 30);
            stmt.run("Barba Completa", 10.00, 20);
            stmt.run("Pack Completo", 22.00, 50);
            stmt.finalize();
            console.log("Services seeded.");
        }
    });
});

db.close();
