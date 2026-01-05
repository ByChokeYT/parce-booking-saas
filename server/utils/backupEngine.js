import fs from 'fs';
import path from 'path';
import cron from 'node-cron';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas
const DB_PATH = path.resolve(__dirname, '../../database.sqlite');
const BACKUP_DIR = path.resolve(__dirname, '../backups');

export const initBackupEngine = () => {
    // Asegurar que existe la carpeta de backups
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // Programar backup diario a las 3:00 AM
    cron.schedule('0 3 * * *', () => {
        performBackup();
    });

    console.log('💾 Backup Engine Initialized [Diario 03:00 AM]');
};

export const performBackup = () => {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `backup-${timestamp}.sqlite`;
        const backupPath = path.join(BACKUP_DIR, backupName);

        // En SQLite simple (WAL mode off), copiar el archivo es suficiente
        // Si hay mucho tráfico, se recomienda usar el comando 'sqlite3 backup'
        fs.copyFileSync(DB_PATH, backupPath);

        console.log(`✅ Backup creado: ${backupName}`);

        // Rotación: Mantener solo los últimos 7 días
        cleanupOldBackups();
    } catch (error) {
        console.error('❌ Error en el backup:', error);
    }
};

const cleanupOldBackups = () => {
    const files = fs.readdirSync(BACKUP_DIR);
    if (files.length > 7) {
        // Ordenar por fecha (nombre del archivo) y borrar los más antiguos
        files.sort().slice(0, files.length - 7).forEach(file => {
            fs.unlinkSync(path.join(BACKUP_DIR, file));
            console.log(`🗑️ Backup antiguo eliminado: ${file}`);
        });
    }
};
