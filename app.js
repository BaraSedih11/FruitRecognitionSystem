const express = require('express');

const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Middleware to parse JSON data

app.get('/main', (req, res) => {
  res.sendFile(__dirname + '/public/views/mainPage.html');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
