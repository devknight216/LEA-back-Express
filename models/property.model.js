const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PropertySchema = new Schema({
  propertyName: { type: String },
  nightlyRate: { type: Number },
  propertyDescription: { type: String },
  imageURLs: [new Schema({
    filename: { type: String },
    url: { type: String }
  })],
  hostInfo: new Schema({
    name: { type: String },
    email: { type: String },
    userId: { type: String }
  }),
  propertyLocation: new Schema({
    apartment: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zip: { type: String }
  }),
  propertyType: { type: String, enum: ['Apartment', 'House', 'Condo / Townhome', 'Secondary Unit', 'Unique Space', 'Bed and Breakfast', 'Boutique Hotel', 'Duplex', 'RV / Camper', 'Tiny House'] },
  propertySpaceFeature: { type: String, enum: ['An entire place', 'A private room', 'A shared room'] },
  guestNum: { type: Number },
  bedsNum: { type: Number },
  bedroomNum: { type: Number },
  bathroomNum: { type: Number },
  amenities: { type: Array },
  propertyDescribe: { type: Array },
  propertyspecialFeature: { type: Array },
  airBnbLink: { type: String }
})

module.exports = mongoose.model('Property', PropertySchema)
