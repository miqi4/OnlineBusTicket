const db = require('../config/db');

const Bus = {
    getAll: (callback) => {
        const sql = `
            SELECT b.*, 
                   c1.nama_kota AS asal_kota, 
                   c2.nama_kota AS tujuan_kota,
                   c.nama AS nama_perusahaan
            FROM bus b
            LEFT JOIN companies c ON b.company_id = c.id
            LEFT JOIN cities c1 ON b.origin_city_id = c1.id
            LEFT JOIN cities c2 ON b.destination_city_id = c2.id
        `;
        db.query(sql, callback);
    },

    getById: (id, callback) => {
        const sql = `
            SELECT b.*, 
                   c1.nama_kota AS asal_kota, 
                   c2.nama_kota AS tujuan_kota,
                   c.nama AS nama_perusahaan
            FROM bus b
            LEFT JOIN companies c ON b.company_id = c.id
            LEFT JOIN cities c1 ON b.origin_city_id = c1.id
            LEFT JOIN cities c2 ON b.destination_city_id = c2.id
            WHERE b.id = ?
        `;
        db.query(sql, [id], (err, results) => {
            if (err) return callback(err, null);
            return callback(null, results[0]);
        });
    },

    create: (data, callback) => {
        const sql = "INSERT INTO bus (nama_bus, company_id, origin_city_id, destination_city_id, jam, estimasi_sampai, total_seats, harga) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sql, [
            data.nama_bus,
            data.company_id,
            data.origin_city_id,
            data.destination_city_id,
            data.jam,
            data.estimasi_sampai,
            data.total_seats,
            data.harga
        ], callback);
    },

    update: (id, data, callback) => {
        const sql = "UPDATE bus SET nama_bus = ?, company_id = ?, origin_city_id = ?, destination_city_id = ?, jam = ?, estimasi_sampai = ?, total_seats = ?, harga = ? WHERE id = ?";
        db.query(sql, [
            data.nama_bus,
            data.company_id,
            data.origin_city_id,
            data.destination_city_id,
            data.jam,
            data.estimasi_sampai,
            data.total_seats,
            data.harga,
            id
        ], callback);
    },

    delete: (id, callback) => {
        const sql = "DELETE FROM bus WHERE id = ?";
        db.query(sql, [id], callback);
    },

    getBuses: (asal, tujuan, callback) => {
        let sql = `
            SELECT b.*, 
                   c1.nama_kota AS asal_kota, 
                   c2.nama_kota AS tujuan_kota,
                   c.nama AS nama_perusahaan
            FROM bus b
            LEFT JOIN companies c ON b.company_id = c.id
            LEFT JOIN cities c1 ON b.origin_city_id = c1.id
            LEFT JOIN cities c2 ON b.destination_city_id = c2.id
        `;
        const params = [];

        if (asal && tujuan) {
            sql += " WHERE c1.nama_kota = ? AND c2.nama_kota = ?";
            params.push(asal, tujuan);
        }

        db.query(sql, params, callback);
    },

    getLocations: (callback) => {
        const sql = "SELECT nama_kota FROM cities ORDER BY nama_kota ASC";
        db.query(sql, callback);
    }
};

module.exports = Bus;
