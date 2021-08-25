const express = require('express');
const passport = require("passport");

const reservationController = require('../../controllers/reservation.controller');

const router = express.Router();

router.post("/", passport.authenticate('jwt', {session: false}), reservationController.create);

router.delete('/:id', passport.authenticate('jwt', {session: false}), reservationController.remove);

router.get('/:id', passport.authenticate('jwt', {session: false}), reservationController.findOne);


module.exports = router;
