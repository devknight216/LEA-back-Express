const express = require('express');
const passport = require("passport");

const propertyController = require('../../controllers/property.controller');
const roleMiddleware = require('../../middleware/roles.middleware');

const router = express.Router();

router.route('/')
  .get(propertyController.list)
  .post(passport.authenticate('jwt', {session: false}), propertyController.create)

router.route('/images')
  .post(passport.authenticate('jwt', {session: false}), propertyController.uploadImage)

router.route('/images/:propertyId')
  .get(propertyController.getPropertyImages)
  .post(passport.authenticate('jwt', {session: false}), propertyController.removePropertyImages)

router.route('/search')
  .post(propertyController.searchProperties)

router.route('/:propertyId')
  .get(propertyController.read)
  .put(passport.authenticate('jwt', {session: false}), propertyController.update)
  .delete(passport.authenticate('jwt', {session: false}), propertyController.remove)

router.param('propertyId', propertyController.getPropertyById)

module.exports = router;
