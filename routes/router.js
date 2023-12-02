const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// Define your routes
router.get('/input', controller.getInputPage);
router.post('/sendData', controller.sendData);
router.get('/output', controller.getOutputPage);

module.exports = router;

