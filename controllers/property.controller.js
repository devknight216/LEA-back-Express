const mongoose = require('mongoose')
const Property = require('../models/property.model')

function create(req, res, next) {
  const property = new Property(req.body)

  Property.find({
    propertyName : req.body.propertyName,
    propertyLocation: {
      zip: req.body['propertyLocation.zip']
    }
  })
  .then((result) => {
    if (!result.length) {
      property.hostInfo.name = req.user.name;
      property.hostInfo.email = req.user.email;
      property.hostInfo.userId = req.user.id;
      property.host = req.user.id;
      property.save()
      .then((newProperty) => {
        req.user.properties.push(newProperty);
        req.user.isHost = true;
        req.user.save()
        .then((newUser) => {
          res.json(newProperty)
        })
        .catch(next)
        //res.json(newProperty)
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
  .populate('reservations')
  .populate('reviews')
  .exec()
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

// Get Properties by HostId
const getPropertiesByhostId = (req, res) => {
  const hostId = req.params.id;
  Property.find({ host: hostId }).populate('reservations').populate('reviews').exec(function(err, properties){
      if (err) return handleError(err);

      res.json(properties);
  });
}

function uploadImage(req, res, next) {
  propertyId = req.body.propertyId

  Property.findById(propertyId)
  .then((property) => {
    property.imageURLs.push({
      filename: req.body.imageURLs.filename,
      url: req.body.imageURLs.url
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
//    nightlyRateRangeFrom,
//    nightlyRateRangeTo,
    maxnightlyRate,
    propertyLocation,
    propertyType,
    propertySpaceFeature,
    guestNum,
    amenities
  } = req.body

  let where = {}

/*
  if (nightlyRateRangeFrom !== '') where = { nightlyRate: { $gte: nightlyRateRangeFrom }}
  if (nightlyRateRangeTo !== '') Object.assign(where, { nightlyRate: { $lte: nightlyRateRangeTo } })
*/
  if (maxnightlyRate) Object.assign(where, { nightlyRate: { $lte: maxnightlyRate} })
//  if (JSON.stringify(propertyLocation) !== JSON.stringify({})) Object.assign(where, { "propertyLocation": propertyLocation })
  if (propertyType) Object.assign(where, { propertyType })
  if (propertySpaceFeature) Object.assign(where, { propertySpaceFeature })
  if (guestNum) Object.assign(where, { guestNum })
  if (amenities && amenities.length) Object.assign(where, {'amenities': {$all: amenities}} )
  if (propertyLocation) {
    if(propertyLocation.state)
      Object.assign(where, {"propertyLocation.state": propertyLocation.state})
    if(propertyLocation.apartment)
      Object.assign(where, {"propertyLocation.apartment": propertyLocation.apartment})
    if(propertyLocation.street)
      Object.assign(where, {"propertyLocation.street": propertyLocation.street})
    if(propertyLocation.city)
      Object.assign(where, {"propertyLocation.city": propertyLocation.city})
    if(propertyLocation.country)
      Object.assign(where, {"propertyLocation.country": propertyLocation.country})
    if(propertyLocation.zip)
      Object.assign(where, {"propertyLocation.zip": propertyLocation.zip})
  }
  if(JSON.stringify(where) === '{}'){
    Property.find()
    .then((properties) => {
      return res.json(properties)
    })
    .catch(err => console.error(err));
  }
  else{
    Property.find(where)
    .then((properties) => {
      return res.json(properties)
    })
    .catch(err => console.error(err))
  }
    
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
  searchProperties,
  getPropertiesByhostId
}
