const db = require('./db');

const queries = [
    "ALTER TABLE bus ADD COLUMN asal VARCHAR(50)",
    "ALTER TABLE bus ADD COLUMN tujuan VARCHAR(50)",
    "UPDATE bus SET asal='Jakarta', tujuan='Bandung' WHERE id % 2 = 0",
    "UPDATE bus SET asal='Bandung', tujuan='Jakarta' WHERE id % 2 != 0"
];

function runQueries(index) {
    if (index >= queries.length) {
        console.log("Migration complete!");
        process.exit(0);
    }
    db.query(queries[index], (err, result) => {
        if (err) {
            // Ignore error if column already exists (duplicate column name)
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log(`Skipping ${queries[index]} (Column likely exists)`);
            } else {
                console.error(err);
            }
        } else {
            console.log(`Executed: ${queries[index]}`);
        }
        runQueries(index + 1);
    });
}

runQueries(0);
