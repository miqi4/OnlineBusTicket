const Pesanan = require('../models/pesananModel');

exports.createPesanan = (req, res) => {
    const data = req.body;
    Pesanan.create(data, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Database Error");
            return;
        }
        res.json({ message: "Pemesanan berhasil!" });
    });
};

exports.getPesanan = (req, res) => {
    Pesanan.getAll((err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Database Error");
            return;
        }
        res.json(result);
    });
};
