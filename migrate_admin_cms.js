const db = require('./config/db');

const queries = [
    // Create companies table
    `CREATE TABLE IF NOT EXISTS companies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        alamat TEXT,
        telepon VARCHAR(20)
    )`,

    // Create routes table
    `CREATE TABLE IF NOT EXISTS routes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        asal VARCHAR(50) NOT NULL,
        tujuan VARCHAR(50) NOT NULL,
        jarak_km INT,
        durasi_jam INT
    )`,

    // Add columns to bus table
    `ALTER TABLE bus ADD COLUMN company_id INT`,
    `ALTER TABLE bus ADD COLUMN route_id INT`,

    // Add Foreign Keys
    `ALTER TABLE bus ADD CONSTRAINT fk_bus_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL`,
    `ALTER TABLE bus ADD CONSTRAINT fk_bus_route FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE SET NULL`
];

function runQueries(index) {
    if (index >= queries.length) {
        console.log("Migration complete!");
        process.exit(0);
    }

    db.query(queries[index], (err, result) => {
        if (err) {
            // Ignore error if column/constraint already exists
            if (err.code === 'ER_DUP_FIELDNAME' || err.code === 'ER_DUP_KEYNAME') {
                console.log(`Skipping query: ${queries[index]} (Already exists)`);
            } else {
                console.error('Error executing query:', err);
            }
        } else {
            console.log(`Executed: ${queries[index]}`);
        }
        runQueries(index + 1);
    });
}

runQueries(0);
