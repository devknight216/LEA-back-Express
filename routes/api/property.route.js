const express = require('express');
const propertyController = require('../../controllers/property.controller');

const router = express.Router();

router.route('/')
  .get(propertyController.list)
  .post(propertyController.create)

router.route('/images')
  .post(propertyController.uploadImage)

router.route('/images/:propertyId')
  .get(propertyController.getPropertyImages)
  .post(propertyController.removePropertyImages)

router.route('/:propertyId')
  .get(propertyController.read)
  .put(propertyController.update)
  .delete(propertyController.remove)

router.param('propertyId', propertyController.getPropertyById)

module.exports = router;
