const express = require('express');
const passport = require("passport");

const propertyController = require('../../controllers/property.controller');
const roleMiddleware = require('../../middleware/roles.middleware');

const router = express.Router();

router.route('/')
  .get(propertyController.list)
  .post(passport.authenticate('jwt', {session: false}), roleMiddleware('CREATE'), propertyController.create)

router.route('/images')
  .post(passport.authenticate('jwt', {session: false}), roleMiddleware('CREATE'), propertyController.uploadImage)

router.route('/images/:propertyId')
  .get(propertyController.getPropertyImages)
  .post(passport.authenticate('jwt', {session: false}), roleMiddleware('DELETE'), propertyController.removePropertyImages)

router.route('/search')
  .post(propertyController.searchProperties)

router.route('/:propertyId')
  .put(passport.authenticate('jwt', {session: false}), roleMiddleware('UPDATE'), propertyController.update)
  .delete(passport.authenticate('jwt', {session: false}), roleMiddleware('DELETE'), propertyController.remove)

router.param('propertyId', propertyController.getPropertyById)

module.exports = router;
