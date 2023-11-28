const express = require('express');
const path = require('path');
const mainPageController = require('../controllers/mainPageController');

const routes = express.Router();

routes.use(express.static(path.join(__dirname, 'public')));

routes.post('/main', mainPageController.startPage);

module.exports = routes;