const express = require('express');
const paymentController = require('../../controllers/payment.controller');

const router = express.Router();

router.post('/payment-intent', paymentController.createIntent);

router.post('/webhook', paymentController.savePaymentStatus);

module.exports = router;
