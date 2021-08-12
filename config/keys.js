const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  // mongoURI: "mongodb://URL:27017/myproject"
  mongoURI: `mongodb://${process.env.DB_HOST || localhost}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME || myproject}`,
  secretOrKey: `${process.env.SECRETORKEY || secretOrKey}`
};

// mongodb: is the protocol definition
// localhost: 27017 is the server we are connecting to
// /myproject: is the database we wish to connect to

// https://mongodb.github.io/node-mongodb-native/2.0/tutorials/connecting/
