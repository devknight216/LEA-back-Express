const express = require('express');
const passport = require('passport')
const paymentController = require('../../controllers/payment.controller');

const router = express.Router();

router.post('/payment-intent', passport.authenticate('jwt', {session: false}), paymentController.createIntent);

router.post('/webhook', paymentController.savePaymentStatus);

module.exports = router;
