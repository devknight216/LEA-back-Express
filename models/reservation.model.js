const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReservationSchema = new Schema({
  property: { type: Schema.ObjectId, ref: 'Property' },
  from: { type: Date },
  to: { type: Date },
  adultNum: { type: Number },
  childrenNum: { type: Number },
  infantsNum: { type: Number },
  petNum: { type: Number },
  total: { type: Number },
  guest: { type: Schema.ObjectId, ref: 'User' },
  paymentIntentId: { type: String },
  paymentStatus: { type: String },
  status: { type: String },
  checkStatus: { 
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Reservation', ReservationSchema)
