const db = require('../config/db');

const Pesanan = {
    create: (data, callback) => {
        const query = "INSERT INTO pesanan (nama_penumpang, bus_id, kursi) VALUES (?, ?, ?)";
        db.query(query, [data.nama_penumpang, data.bus_id, data.kursi], callback);
    },
    getAll: (callback) => {
        const query = `SELECT p.id, p.nama_penumpang, b.nama_bus, b.jam, p.kursi 
                   FROM pesanan p 
                   JOIN bus b ON p.bus_id=b.id`;
        db.query(query, callback);
    }
};

module.exports = Pesanan;
