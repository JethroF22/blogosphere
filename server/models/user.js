const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email"
    }
  },
  password: {
    required: true,
    type: String,
    minlength: 8
  },
  username: {
    type: String,
    required: true,
    minlength: 6
  },
  token: {
    type: String,
    required: true
  }
});

UserSchema.methods.generateAuthToken = function() {
  const user = this;

  const token = jwt.sign(
    { _id: user._id.toHexString() },
    process.env.JWT_SECRET
  );
  user.token = token;
  user.save().then(() => {
    return token;
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = {
  User
};
