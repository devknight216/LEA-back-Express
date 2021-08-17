const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PropertySchema = new Schema({
  propertyName: { type: String },
  nightlyRate: { type: Number },
  propertyDescription: { type: String },
  createdData: { type: String },
  images: new Schema({
    fileName: { type: String },
    url: { type: String }
  }),
  hostedBy: new Schema({
    name: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    location: { type: String }
  }),
  propertyLocation: new Schema({
    country: { type: String },
    streetAddress: { type: String },
    city: { type: String },
    stateProvice: { type: String },
    zip: { type: String }
  }),
  propertyFeatures: new Schema({
    placeFeature: { type: String, enum: ['Apartment', 'House', 'Secondary Unit', 'Unique Space', 'Bed and Breakfast', 'Boutique Hotel'] },
    placeDescribe: { type: String, enum: ['Rental Unit', 'Condominium (Condo)', 'Loft', 'Serviced Apartment'] },
    placeSpaceFeature: { type: String, enum: ['An entire place', 'A private room', 'A sahred room'] },
    guestNum: { type: Number },
    bedNum: { type: Number },
    bedroomNum: { type: Number },
    bathroomNum: { type: Number },
    placeOffer: new Schema({
      standoutAmenities: [{ type: String }],
      guestFavorites: [{ type: String }],
      safetyItem: [{ type: String }]
    }),
    specialDescribe: [{ type: String }],
    fewQuestions: [{ type: String }]
  }),
  airBnbLink: { type: String }
})

module.exports = mongoose.model('Property', PropertySchema)
