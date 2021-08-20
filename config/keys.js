const dotenv = require('dotenv')

// initializing env variables
try {
  dotenv.config()
} catch (e) {
  console.log('Could not find .env file. Continuing..')
}

module.exports = {
  // mongoURI: "mongodb://URL:27017/myproject"
  mongoURI: `${process.env.DB_URL || localhost}`,
  secretOrKey: `${process.env.SECRETORKEY || secretOrKey}`,
  port: process.env.PORT
};
