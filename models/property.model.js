const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PropertySchema = new Schema({
  propertyName: { type: String },
  nightlyRate: { type: Number },
  propertyDescription: { type: String },
  imageURLs: [{
    filename: { type: String },
    url: { type: String }
  }],
  hostInfo: {
    name: { type: String },
    email: { type: String },
    userId: { type: String }
  },
  propertyLocation: {
    apartment: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zip: { type: Number }
  },
  petAllowFee: { 
    number: { type: Number },
    fee: { type: Number }
  },
  depositFee: { type: Number },
  stagingFee: { 
    hours: { type: Number },
    rate: { type: Number }
  },
  propertyType: { type: String, enum: ['Apartment', 'House', 'Condo / Townhome', 'Secondary Unit', 'Unique place', 'Bed and Breakfast', 'Boutique Hotel', 'Duplex', 'RV / Camper', 'Tiny House'] },
  propertySpaceFeature: { type: String, enum: ['An entire place', 'A private room', 'A shared room'] },
  manageType: {type: String, enum: ['LEA', 'HOST']},
  guestNum: { type: Number },
  bedsNum: { type: Number },
  bedroomNum: { type: Number },
  bathroomNum: { type: Number },
  amenities: { type: Array },
  propertyDescribe: { type: Array },
  propertyspecialFeature: { type: Array },
  airBnbLink: { type: String },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }],
  reservations: [{
    type: Schema.Types.ObjectId,
    ref: 'Reservation'
  }],
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = mongoose.model('Property', PropertySchema)
