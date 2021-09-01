const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema
const ROLES = require('../constants/role')

const UserSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, trim: true, default: '' },
  email: { type: String, unique: true, required: true, trim: true },
  phone: { type: String, unique: false, required: false, trim: true },
  password: { type: String },
  avatarURL: { type: String },
  stripe_account: { type: String },
  role: { type: String, required: true, enum: Object.values(ROLES), default: ROLES.USER },
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  phone_verified: {
    type: Boolean,
    required: true,
    default: false
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  reviews: [{ 
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }],
  reservations: [{
    type: Schema.Types.ObjectId,
    ref: 'Reservation'
  }],
  properties: [{
    type: Schema.Types.ObjectId,
    ref: 'Property'
  }],
  isHost: {
    type: Boolean
  }
});

UserSchema.methods.generateVerificationToken = function () {
  const user = this;
  const verificationToken = jwt.sign(
      { ID: user._id },
      process.env.USER_VERIFICATION_TOKEN_SECRET,
      { expiresIn: "7d" }
  );
  return verificationToken;
};

UserSchema.methods.generateResetPasswordToken = function () {
  const user = this;
  const crypto = require("crypto");
  crypto.randomBytes(20, (err, buf) => {
    if (err) {
      // Prints error
      console.log(err);
      return;
    }
    
    // Prints random bytes of generated data
    return buf.toString('hex');
  });
};

module.exports = mongoose.model('User', UserSchema)
