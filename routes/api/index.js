const express = require('express');

const propertyRoute = require('./property.route');
const authenticationRoute = require('./authentication.route');
const accountRoute = require('./accounts.route');

const router = express.Router();

router
    .use('/property', propertyRoute)
    .use('/users', authenticationRoute)
    .use('/accounts', accountRoute);
module.exports = router;
