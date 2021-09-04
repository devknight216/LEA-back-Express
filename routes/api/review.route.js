const express = require('express');
const passport = require("passport");

const reviewController = require('../../controllers/review.controller')

const router = express.Router();

router.post("/", passport.authenticate('jwt', {session: false}), reviewController.create);

router.delete('/:id', passport.authenticate('jwt', {session: false}), reviewController.remove);

//router.get('/:id', passport.authenticate('jwt', {session: false}), reviewController.findOne);

router.get('/', passport.authenticate('jwt', {session: false}), reviewController.findAll)

router.delete('/', passport.authenticate('jwt', {session: false}), reviewController.removeAll)

module.exports = router;
