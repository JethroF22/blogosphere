const mongoose = require("mongoose");

const uri = process.env.MONGODB_URL;

mongoose.Promise = global.Promise;
mongoose.connect(
  uri,
  () => {
    console.log(`Connected to db at ${uri}`);
  }
);

module.exports = {
  mongoose
};
