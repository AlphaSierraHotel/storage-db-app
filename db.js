const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const db = new sqlite3.Database(process.env.DATABASE_URL);

db.serialize(() => {
    // Create Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL -- 'admin' or 'user'
        );
    `);

    // Check if admin user exists
    db.get(`SELECT * FROM users WHERE role = 'admin'`, (err, row) => {
        if (!row) {
            const adminUsername = process.env.ADMIN_USERNAME || 'admin';
            const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
            const hashedPassword = bcrypt.hashSync(adminPassword, 10);

            db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, 
                [adminUsername, hashedPassword, 'admin'], (err) => {
                if (err) {
                    console.error('Failed to create admin user:', err);
                } else {
                    console.log(`Admin user created with username: ${adminUsername}`);
                }
            });
        }
    });

    // Create HDD Entries table
    db.run(`
        CREATE TABLE IF NOT EXISTS hdd_entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            time TEXT,
            disk_model TEXT,
            serial_number TEXT,
            capacity TEXT,
            smart_health TEXT,
            smart_details TEXT
        );
    `);

    // Create API Keys table
    db.run(`
        CREATE TABLE IF NOT EXISTS api_keys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT UNIQUE NOT NULL,
            user_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
});

module.exports = db;
