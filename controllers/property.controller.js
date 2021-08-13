const mongoose = require('mongoose')
const Property = require('../models/property.model')

function create(req, res, next) {
  const property = new Property(req.body)

  Property.find({
    propertyName : req.body.propertyName,
    'propertyLocation.zip': req.body.propertyLocation.zip
  })
  .then((result) => {
    if (!result.length) {
      property.save()
      .then((newProperty) => {
        res.json(newProperty)
      })
      .catch(next)
    } else {
      res.json({ message: 'Property already exist'})
    }
  })
  .catch(next)
}

function update(req, res, next) {
  Object.assign(req.property, req.body)

  req.property.save()
  .then((updatedProperty) => {
    res.json(updatedProperty)
  })
  .catch(next)
}

function read(req, res) {
  res.json(req.property)
}

function list(req, res, next) {
  let where = {}

  Property.find(where)
  .then((properties) => {
    res.json(properties)
  })
  .catch(next)
}

function remove(req, res, next) {
  req.property.remove()
  .then(() => {
    res.json({ message: 'Property removed successfully'})
  })
  .catch(next)
}

function getPropertyById(req, res, next, id) {
  Property.findById(id)
  .then((property) => {
    if (!property) {
      res.status(404).json({ message: 'Property not found' })
      return
    }

    req.property = property
    next()
  })
  .catch(next)
}

function uploadImage(req, res, next) {
  propertyId = req.body.propertyId

  Property.findById(propertyId)
  .then((property) => {
    property.images.push({
      fileName: req.body.fileName,
      url: req.body.url
    })

    property.save()
    .then((updatedProperty) => {
      res.json(updatedProperty)
    })
    .catch(next)
  })
  .catch(next)
}

function getPropertyImages(req, res, next) {
  Property.findById(req.params.propertyId)
  .then((property) => {
    res.json(property.images)
  })
  .catch(next)
}

function removePropertyImages(req, res, next) {
  Property.findById(req.params.propertyId)
  .then((property) => {
    property.images = []

    property.save()
    .then(() => {
      res.json({ message: 'Images for property have been removed' })
    })
    .catch(next)
  })
  .catch(next)
}

function searchProperties(req, res, next) {
  const {
    nightlyRateRangeFrom,
    nightlyRateRangeTo,
    location,
    propertyType,
    propertySpaceFeature,
    guestNum,
    amenities
  } = req.body

  let where = {}

  if (nightlyRateRangeFrom !== '') where = { nightlyRate: { $gte: nightlyRateRangeFrom }}
  if (nightlyRateRangeTo !== '') Object.assign(where, { nightlyRate: { $lte: nightlyRateRangeTo } })
  if (location !== {}) Object.assign(where, { propertyLocation: location })
  if (propertyType) Object.assign(where, { propertyType })
  if (propertySpaceFeature) Object.assign(where, { propertySpaceFeature })
  if (guestNum) Object.assign(where, { guestNum })
  if (amenities.length) Object.assign(where, { amenities })

  Property.find(where)
  .then((properties) => {
    res.json(properties)
  })
  .catch(next)
}

module.exports = {
  create,
  update,
  read,
  list,
  remove,
  getPropertyById,
  uploadImage,
  getPropertyImages,
  removePropertyImages,
  searchProperties
}
