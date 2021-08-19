const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ROLES = require('../constants/role')

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true, default: '' },
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String },
  role: { type: String, required: true, enum: Object.values(ROLES), default: ROLES.USER }
})

module.exports = mongoose.model('User', UserSchema)
