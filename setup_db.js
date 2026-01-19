const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    multipleStatements: true
};

const connection = mysql.createConnection(dbConfig);

const sqlPath = path.join(__dirname, 'database.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

console.log('Connecting to MySQL...');

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected! Executing SQL script...');

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing SQL script:', err);
            process.exit(1);
        } else {
            console.log('Database setup completed successfully!');
            // Verify by listing tables
            connection.query('USE db_bus', (err) => {
                if (err) console.error('Error selecting database:', err);
                connection.query('SHOW TABLES', (err, rows) => {
                    if (err) {
                        console.error('Error showing tables:', err);
                    } else {
                        console.log('Tables in db_bus:');
                        console.table(rows);
                    }
                    connection.end();
                });
            });
        }
    });
});
