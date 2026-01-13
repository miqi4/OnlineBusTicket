const db = require('./config/db');

db.query("SHOW COLUMNS FROM bus", (err, result) => {
    if (err) {
        console.error('Error fetching schema:', err);
        process.exit(1);
    }
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
});
