const db = require('./config/db');

const queries = [
    // Add company_id to routes table
    `ALTER TABLE routes ADD COLUMN company_id INT`,
    `ALTER TABLE routes ADD CONSTRAINT fk_route_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE`
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
