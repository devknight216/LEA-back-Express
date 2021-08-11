const express = require('express');

const propertyRoute = require('./property.route');

const router = express.Router();

router.use('/property', propertyRoute);

module.exports = router;
