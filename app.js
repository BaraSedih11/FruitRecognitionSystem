const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3000;

const sessionConfig = require('./config/sessionConfig');
const router = require('./routes/router');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Middleware to parse JSON data


app.use('/main', router);


app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
