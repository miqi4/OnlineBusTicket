const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

const busRoutes = require('./routes/bus');
const pesananRoutes = require('./routes/pesanan');

app.use('/api/bus', busRoutes);
app.use('/api/pesanan', pesananRoutes);

app.listen(3000, ()=>{
  console.log("Server running at http://localhost:3000");
});
