const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const nodemailer = require("nodemailer");

const User = require('../models/user.model')
const keys = require("../config/keys");

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
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      });

      // Generate a verification token with the user's ID
      const verificationToken = user.generateVerificationToken();

      // Email the user a unique verification link
      const url = `http://localhost:5000/api/verify/${verificationToken}`;

      const {email} = req.body; 
      transporter.sendMail({
        to: email,
        subject: 'Verify Account',
        html: `Click <a href = '${url}'>here</a> to confirm your email.`
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
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check if user has been verified
    if(!user.verified){
      return res.status(403).send({ 
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
          name: user.name
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
              role: user.role
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  }); 
}

const verify = (req, res) => {
  const token = req.params;

  // Check we have an id
  if (!token) {
    return res.status(422).send({ 
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
      return res.status(500).send(err);
  }

  try{
    // Find user with matching ID
    User.findOne({ _id: payload.ID }).then(user => {
      if (!user) {
        return res.status(404).send({ 
           message: "User does not  exists" 
        });
      }
      // Update user verification status to true
      user.verified = true;
      // await user.save();
      return res.status(200).send({
           message: "Account Verified"
      });
    });
    
  } catch (err) {
    return res.status(500).send(err);
  }
}

const forgot = (req, res) => {
  const {email} = req.body;
  User.findOne({email}).then(user=>{

    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    } else {
      const crypto = require('crypto');
      const buf = crypto.randomBytes(20);
      token = buf.toString('hex');
      user.resetPasswordToken = token;
      const url = `http://localhost:5000/api/reset/${token}`;

      transporter.sendMail({
        to: email,
        subject: 'Reset Password',
        html: `Click <a href = '${url}'>here</a> to confirm your email.`
      });
    }

  });
}

const reset = (req, res) => {
  const token = req.params;

  // Check we have an id
  if (!token) {
    return res.status(422).send({ 
         message: "Missing Token" 
    });
  }

  // Find user with matching ID
  User.findOne({ resetPasswordToken: token }).then(user => {
    if (!user) {
      return res.status(404).send({ 
         message: "User does not  exists" 
      });
    }

    return res.json(user);
  });

}

const store_password = (req, res) => {
  const {email, password} = req.body;

  User.findOne({email}).then(user=>{

    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    } else {
      user.password = password;

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => {
              console.log(err);
            });
        });
      });
    }

  });
}

module.exports = {
  login,
  register,
  verify,
  forgot,
  reset,
  store_password
}
