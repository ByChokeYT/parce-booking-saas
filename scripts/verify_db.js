import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '../database.sqlite');

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    }
});

db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.log("Tables found in database:");
    rows.forEach((row) => {
        console.log(`- ${row.name}`);
    });
    db.close();
});
