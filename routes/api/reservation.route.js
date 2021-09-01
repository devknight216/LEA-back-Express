const express = require('express');
const passport = require("passport");

const reservationController = require('../../controllers/reservation.controller');

const router = express.Router();

router.post("/", passport.authenticate('jwt', {session: false}), reservationController.create);

router.delete('/:id', passport.authenticate('jwt', {session: false}), reservationController.remove);

router.get('/:id', passport.authenticate('jwt', {session: false}), reservationController.findOne);

router.put('/:id', passport.authenticate('jwt', {session: false}), reservationController.updateStatus );

router.get('/', passport.authenticate('jwt', {session: false}), reservationController.findAll)

router.delete('/', passport.authenticate('jwt', {session: false}), reservationController.removeAll)

module.exports = router;
