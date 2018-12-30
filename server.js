const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// import environment variables
require("dotenv").config();
require("dotenv-safe").config();

// import route files
const auth = require("./routes/api/auth");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

// destructured import environment variables
const {
  API_PORT,
  DB_NAME,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD
} = process.env;

// define defaults
const port = API_PORT || 5000;
const mongoURI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const app = express();

// body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());
// passport config
require("./config/passport")(passport);

// Connect to DB
mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true }
    // mongo v >= 4.0.0 requires a useNewUrlParser flag, older string parser will be deprecated soon.
    // the newUrlParser also takes care of any escape characters in the url
    // eg: spaces in the password.
  )
  .then(() => console.log("Connected to DB"))
  .catch(error => console.log(error));

// Fix: DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
// refer documentation: https://mongoosejs.com/docs/deprecations.html#-ensureindex-
mongoose.set("useCreateIndex", true);

// Basic Route
app.get("/", (req, res) => res.send(`Server running on port ${port}`));

// Use Routes
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Start Server
app.listen(port, () => console.info(`Server started on port ${port}`));
