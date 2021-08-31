const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");

const create = (req, res) => {
    // Validate request
    if(!req.body) {
        return res.status(400).json({
        message: "Please fill all required field"
        });
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          return res.status(400).json({ message: "Email already exists" });
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
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
};

const findAll = (req, res) => {
    User.find()
        .then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).json({
                message: "Something went wrong while getting list of users."
            });
        });
};

const findOne = (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if(!user) {
                return res.status(404).json({
                    message: "User not found with id " + req.params.id
                });
            }
            res.json(user);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).json({
                    message: "User not found with id " + req.params.id
                });
             }
            return res.status(500).json({
                message: "Error getting user with id " + req.params.id
            });
        });
}

const update = (req, res) => {
     // Validate Request
    if(!req.body) {
        return res.status(400).send({
            message: "Please fill all required field"
        });
    }
    Object.assign(req.user, req.body)
    
    if(req.body.password){
        const hashedpassword = req.body.password;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(hashedpassword, salt, (err, hash) => {
            if (err) throw err;

            // Find user and update it with the request body
            User.findByIdAndUpdate(req.params.id, {
                
                password: hash,
                
            }, {new: true})
            .then(user => {
                if(!user) {
                    return res.status(404).json({
                        message: "user not found with id " + req.params.id
                    });
                }
                res.json(user);
            }).catch(err => {
                if(err.kind === 'ObjectId') {
                    return res.status(404).json({
                        message: "user not found with id " + req.params.id
                    });
                }
                return res.status(500).json({
                    message: "Error updating user with id " + req.params.id
                });
            });

            });
        });
    }
    
    req.user.save()
    .then((updatedUser) => {
        res.json(updatedUser)
    })
    .catch(err => {
        return res.json({message: "Cannot Update"})
    })
    
}

const deleteOne = (req, res) => {
    User.findByIdAndRemove(req.params.id)
    .then(user => {
        if(!user) {
            return res.status(404).json({
                message: "user not found with id " + req.params.id
            });
        }
        res.json({message: "user deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).json({
                message: "user not found with id " + req.params.id
            });
        }
        return res.status(500).json({
            message: "Could not delete user with id " + req.params.id
        });
    });
}

module.exports = {
    create,
    findAll,
    findOne,
    update,
    deleteOne
}