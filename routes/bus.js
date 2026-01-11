const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const { asal, tujuan } = req.query;
  let sql = "SELECT * FROM bus";
  const params = [];

  if (asal && tujuan) {
    sql += " WHERE asal = ? AND tujuan = ?";
    params.push(asal, tujuan);
  }

  db.query(sql, params, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

module.exports = router;
