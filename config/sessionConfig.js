const session = require('express-session');
const secretKey = require('./secretKey');

const sessionConfig = {
  secret: secretKey.getSecretKey(), 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
};


module.exports = sessionConfig;


