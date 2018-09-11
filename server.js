const express = require("express");

require("dotenv").config();
require("dotenv-safe").config();

const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send(`Server running on port ${port}`));

app.listen(port, () => console.info(`Server started on port ${port}`));
