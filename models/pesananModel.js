const db = require('../config/db');

const Pesanan = {
    create: (data, callback) => {
        const query = "INSERT INTO pesanan (nama_penumpang, bus_id, kursi) VALUES (?, ?, ?)";
        db.query(query, [data.nama_penumpang, data.bus_id, data.kursi], callback);
    },
    getAll: (callback) => {
        const query = `SELECT p.id, p.nama_penumpang, b.nama_bus, b.jam, p.kursi, p.bus_id 
                   FROM pesanan p 
                   JOIN bus b ON p.bus_id=b.id`;
        db.query(query, callback);
    },
    getById: (id, callback) => {
        const query = "SELECT * FROM pesanan WHERE id = ?";
        db.query(query, [id], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results[0]);
        });
    },
    updateBus: (id, busId, callback) => {
        const query = "UPDATE pesanan SET bus_id = ? WHERE id = ?";
        db.query(query, [busId, id], callback);
    },
    updateSeat: (id, seat, callback) => {
        const query = "UPDATE pesanan SET kursi = ? WHERE id = ?";
        db.query(query, [seat, id], callback);
    },
    delete: (id, callback) => {
        const query = "DELETE FROM pesanan WHERE id = ?";
        db.query(query, [id], callback);
    }
};

module.exports = Pesanan;
