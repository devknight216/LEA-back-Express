const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');


const User = require('../models/user.model')
const keys = require("../config/keys");
const twilio = require("../service/twilio");

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

// Create Transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  }
});

const register = (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    } else {
      const newUser = new User({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
      });

      // Generate a verification token with the user's ID
      const verificationToken = newUser.generateVerificationToken();
      const server_port = keys.port;
      const siteURL = keys.siteURL;
      // Email the user a unique verification link
      const url = `${siteURL}/verify/${verificationToken}`;

      const {email} = req.body; 

      transporter.sendMail({
        to: email,
        subject: 'Verify Account',
        html: `<div style='text-align: center'>
                <h2>You have a message from LegendaryEstatesAirbnb</h2>
                <h3>Click <a href = '${url}' >here</a> to confirm your email.</h3>
              </div>`
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
}

const login = (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const {email, password, rememberMe} = req.body;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Check if user has been verified
    if(!user.verified){
      return res.status(403).json({ 
            message: "Verify your Account." 
      });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: rememberMe ? 31556926 : 24*3600
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              phone: user.phone,
              isHost: user.isHost,
              avatarURL: user.avatarURL
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ message: "Password incorrect" });
      }
    });
  }); 
}

const verify = (req, res) => {
  const token = req.params['token'];
  console.log("asdfa:",token);
  // Check we have an id
  if (!token) {
    return res.status(422).json({ 
         message: "Missing Token" 
    });
  }

  // Verify the token from the URL
  let payload = null
  try {
      payload = jwt.verify(
         token,
         process.env.USER_VERIFICATION_TOKEN_SECRET
      );
  } catch (err) {
      return res.status(500).json(err);
  }

  try{
    // Find user with matching ID
    User.findOne({ _id: payload.ID }).then(user => {
      if (!user) {
        return res.status(404).json({ 
           message: "User does not  exists" 
        });
      }
      // Update user verification status to true
      user.verified = true;
      user.save();
      return res.status(200).json({
           message: "Account Verified"
      });
    });
    
  } catch (err) {
    return res.status(500).json(err);
  }
}

const forgot = (req, res) => {
  const {email} = req.body;
  User.findOne({email})
  .then(user=>{
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    } else {
      const crypto = require('crypto');
      const buf = crypto.randomBytes(20);
      token = buf.toString('hex');
      user.resetPasswordToken = token;
      user.save();
      const server_port = keys.port;
      const siteURL = keys.siteURL;
      const url = `${siteURL}/reset/${token}`;

      transporter.sendMail({
        to: email,
        subject: 'Reset Password',
        html: `<div style='text-align: center'>
                  <h2>You have a message from LegendaryEstatesAirbnb</h2>
                  <h3>Click <a href = '${url}' >here</a> to confirm your email.</h3>
              </div>`
      });
      return res.status(200).json({message: "success"});
    }
  });
}

const reset = (req, res) => {
  const token = req.params['token'];

  // Check we have an id
  if (!token) {
    return res.status(422).json({ 
         message: "Missing Token" 
    });
  }

  // Find user with matching ID
  User.findOne({ resetPasswordToken: token }).then(user => {
    if (!user) {
      return res.status(404).json({ 
         message: "User does not  exists" 
      });
    }

    return res.json(user);
  });

}

const store_password = (req, res) => {
  const {email, password, token} = req.body;

  User.findOne({email}).then(user=>{

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    } else {
      if(user.resetPasswordToken!=token){
        return res.status(401).json({ message: "Not allowed to reset password" })
      }  
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user
            .save()
            .then(user => res.json(user))
            .catch(err => {
              console.log(err);
            });
        });
      });
    }


    return res.json({message: "success"});
  });
}

const phone_verify = (req, res) => {
  const {body, to} = req.body;
  twilio.sendSMS(body, to);
  return res.status(200).json({message: "successfully sent"});
}

const send = (req, res) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
  const client = require('twilio')(accountSid, authToken);

  client.messages
    .create({
      body: 'This is the message from LEA',
      from: '+16514017695',
      to: '+12127290149'
    })
    .then(message => console.log(message.sid))
    .catch(err => console.log(err));
    return res.json({message: "success"});
};

const sendCode = (req, res) => {
  const {to} = req.body;
  twilio.sendCode(to);
  return res.status(200).json({message: "verification code sent"});
}

const checkCode = (req, res) => {
  const {to, code} =req.body;
  twilio.checkCode(to, code);
  return res.status(200).json({message: "verification code checked"});
}

const stripe_account = async (req, res) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST_KEY)
  const email = req.user.email;
  const account = await stripe.accounts.create({
    type: 'express',
    email
  });
  
  if(!req.user.stripe_account){
    req.user.stripe_account = await account.id;
    await req.user.save();
  }
  return res.status(200);
}

const stripe_link = async (req, res) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST_KEY);

  const refresh_url = await req.body.refresh_url;
  const return_url = await req.body.return_url;
  const account = await req.user.stripe_account;
  const accountLinks = await stripe.accountLinks.create({
    account,
    refresh_url,
    return_url,
    type: 'account_onboarding',
  });

  return res.json(accountLinks.url);

}

module.exports = {
  login,
  register,
  verify,
  forgot,
  reset,
  store_password,
  phone_verify,
  send,
  sendCode,
  checkCode,
  stripe_account,
  stripe_link
}
