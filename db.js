const mysql = require('mysql2');

const db = mysql.createConnection({
  host:'localhost',
  user:'iqbal',
  password:'12345',
  database:'db_bus'
});

db.connect(err=>{
  if(err) throw err;
  console.log("Database connected!");
});

module.exports = db;
