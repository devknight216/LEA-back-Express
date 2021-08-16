const express = require('express');
const authenticationController = require('../../controllers/authentication.controller');

const router = express.Router();

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", authenticationController.register);

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", authenticationController.login);

module.exports = router;
