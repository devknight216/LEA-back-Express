const express = require('express');

const propertyRoute = require('./property.route');
const authenticationRoute = require('./authentication.route');

const router = express.Router();

router
    .use('/property', propertyRoute)
    .use('/users', authenticationRoute);

module.exports = router;
