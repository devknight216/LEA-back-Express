const express = require('express');
const passport = require("passport");
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

router.get('/verify/:token', authenticationController.verify);

router.post('/forgot', authenticationController.forgot);

router.post('/store_password', authenticationController.store_password);

router.get('/reset/:token', authenticationController.reset);

router.post('/phone_verify', authenticationController.phone_verify);

router.post('/send', authenticationController.send);

router.post('/send_code', authenticationController.sendCode);

router.post('/check_code', authenticationController.checkCode);

router.post('/stripe_account', passport.authenticate('jwt', {session: false}), authenticationController.stripe_account);

router.post('/stripe_link', passport.authenticate('jwt', {session: false}), authenticationController.stripe_link);

module.exports = router;
