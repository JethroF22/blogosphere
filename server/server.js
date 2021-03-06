const env = process.env.NODE_ENV || "development";

if (env === "development") {
  require("dotenv").config();
} else if (env === "test") {
  require("dotenv").config({ path: "./.env.test" });
}

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const { mongoose } = require("./db/mongoose");
const auth = require("./routes/auth");
const blog = require("./routes/blog");
const profile = require("./routes/profile");

const app = express();
app.use(cors());
const publicPath = path.join(__dirname, "..", "public");
app.use(bodyParser.json());
app.use(express.static(publicPath));
app.use("/auth", auth);
app.use("/blog", blog);
app.use("/profile", profile);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`Server is live on port ${process.env.PORT}`);
});

module.exports = app;
