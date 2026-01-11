const db = require('../config/db');

const Bus = {
    getBuses: (asal, tujuan, callback) => {
        let sql = "SELECT * FROM bus";
        const params = [];

        if (asal && tujuan) {
            sql += " WHERE asal = ? AND tujuan = ?";
            params.push(asal, tujuan);
        }

        db.query(sql, params, callback);
    },

    getLocations: (callback) => {
        const sql = "SELECT DISTINCT asal FROM bus UNION SELECT DISTINCT tujuan FROM bus";
        db.query(sql, callback);
    }
};

module.exports = Bus;
