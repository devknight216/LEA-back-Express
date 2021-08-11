const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReviewSchema = new Schema({
  propertyId: { type: Schema.ObjectId, ref: 'Property' },
  title: { type: String },
  contents: { type: String },
  score: { type: Number },
  creator: { type: Schema.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Review', ReviewSchema)
