const express = require('express');

const propertyRoute = require('./property.route');
const authenticationRoute = require('./authentication.route');
const accountRoute = require('./accounts.route');
const emailRoute = require('./email.route');

const router = express.Router();

router
    .use('/property', propertyRoute)
    .use('/users', authenticationRoute)
    .use('/accounts', accountRoute)
    .use('/email', emailRoute);
module.exports = router;
