const express = require('express');
const emailController = require('../../controllers/email.controller');

const router = express.Router();

router.post('/contact-us', emailController.contactus);

module.exports = router;
