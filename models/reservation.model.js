const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReservationSchema = new Schema({
  property: { type: Schema.ObjectId, ref: 'Property' },
  from: { type: String },
  to: { type: String },
  guestNum: { type: Number },
  price: { type: Number },
  total: { type: Number },
  guest: { type: Schema.ObjectId, ref: 'User' },
  paymentIntentId: { type: String },
  paymentStatus: { type: String }
})

module.exports = mongoose.model('Reservation', ReservationSchema)
