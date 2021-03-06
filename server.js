const express = require("express")
const mongoose = require("mongoose") // Connector for MongoDB
const bodyParser = require("body-parser") // Let us use requests
const apiRoutes = require('./routes/api')
const passport = require("passport")
const cors = require('cors')
const config = require('./config/keys')

// require the const endpointName = require("./routes/api/endpointName"); here

const app = express();

// Middleware for BodyParser
// body-parser: extract the entire body portion of incoming request and exposes it on request.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Allow cors
app.use(cors())

// MongoDB config og connection
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

// Uses the routes from routes/api/items.js
//app.use("/api/endpointName", endpointName);


// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

app.use('/api', apiRoutes);

const port = config.port || 3001; // Sets port for server

app.listen(port, () => console.log(`Server started on port ${port}`));
