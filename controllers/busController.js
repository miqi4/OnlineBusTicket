const Bus = require('../models/busModel');

exports.getBuses = (req, res) => {
    const { asal, tujuan } = req.query;
    Bus.getBuses(asal, tujuan, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Database Error");
            return;
        }
        res.json(result);
    });
};

exports.getLocations = (req, res) => {
    Bus.getLocations((err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Database Error");
            return;
        }
        // Extract city names from the result
        const locations = result.map(row => row.nama_kota);
        res.json(locations);
    });
};
