const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req,res)=>{
  const {nama_penumpang, bus_id, kursi} = req.body;

  db.query(
    "INSERT INTO pesanan (nama_penumpang,bus_id,kursi) VALUES (?,?,?)",
    [nama_penumpang,bus_id,kursi],
    (err,result)=>{
      if(err) throw err;
      res.json({message:"Pemesanan berhasil!"});
    }
  );
});

router.get('/', (req,res)=>{
  db.query(
    `SELECT p.id, p.nama_penumpang, b.nama_bus, b.jam, p.kursi 
     FROM pesanan p 
     JOIN bus b ON p.bus_id=b.id`,
    (err,result)=>{
      if(err) throw err;
      res.json(result);
    }
  );
});

module.exports = router;
