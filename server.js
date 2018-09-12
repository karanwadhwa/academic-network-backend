const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();
require("dotenv-safe").config();

const app = express();
const {
  API_PORT,
  DB_NAME,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD
} = process.env;

const port = API_PORT || 5000;
const mongoURI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

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

app.get("/", (req, res) => res.send(`Server running on port ${port}`));

app.listen(port, () => console.info(`Server started on port ${port}`));
