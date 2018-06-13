require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const { mongoose } = require("./db/mongoose");
const auth = require("./routes/auth");

const app = express();
const publicPath = path.join(__dirname, "..", "public");
app.use(bodyParser.json());
app.use(express.static(publicPath));
app.use("/auth", auth);

app.listen(3000, () => {
  console.log("Server is live on port 3000");
});
