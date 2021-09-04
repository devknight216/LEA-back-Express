const express = require('express');

const propertyRoute = require('./property.route');
const authenticationRoute = require('./authentication.route');
const accountRoute = require('./accounts.route');
const emailRoute = require('./email.route');
const reservationRoute = require('./reservation.route');
const paymentRoute = require('./payment.route');
const reviewRoute = require('./review.route')

const router = express.Router();

router
    .use('/property', propertyRoute)
    .use('/users', authenticationRoute)
    .use('/accounts', accountRoute)
    .use('/email', emailRoute)
    .use('/reservation', reservationRoute)
    .use('/payment', paymentRoute)
    .use('/review', reviewRoute);
module.exports = router;
