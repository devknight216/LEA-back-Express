const dotenv = require('dotenv')

// initializing env variables
try {
  dotenv.config()
} catch (e) {
  console.log('Could not find .env file. Continuing..')
}

module.exports = {
  mongoURI: process.env.DB_URL,
  siteURL: process.env.SITE_URL,
  secretOrKey: process.env.SECRETORKEY,
  port: process.env.PORT
};
