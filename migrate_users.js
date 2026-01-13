const db = require('./config/db');
const bcrypt = require('bcrypt');

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('customer', 'operator', 'admin') NOT NULL DEFAULT 'customer',
        nama_perusahaan VARCHAR(50) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

async function migrate() {
    try {
        // Create table
        await db.promise().query(createTableQuery);
        console.log("Table 'users' created or already exists.");

        // Check if admin exists
        const [rows] = await db.promise().query("SELECT * FROM users WHERE email = 'admin@bustion.com'");

        if (rows.length === 0) {
            // Create default admin
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await db.promise().query(
                "INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)",
                ['Admin', 'admin@bustion.com', hashedPassword, 'admin']
            );
            console.log("Default admin account created.");
        } else {
            console.log("Admin account already exists.");
        }

        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
