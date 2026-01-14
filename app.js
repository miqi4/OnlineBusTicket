require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

const session = require('express-session');
const authRoutes = require('./routes/auth');
const busRoutes = require('./routes/bus');
const pesananRoutes = require('./routes/pesanan');
const adminRoutes = require('./routes/adminRoutes');

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_key_bustion',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use('/api/bus', busRoutes);
app.use('/api/pesanan', pesananRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
