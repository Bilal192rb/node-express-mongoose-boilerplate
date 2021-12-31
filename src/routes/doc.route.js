const express = require('express');
const { docController } = require('../controllers');

const router = express.Router();

router.get('/', docController.documentation);

module.exports = router;
