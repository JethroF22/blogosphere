const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
  },
  photo: {
    type: String,
    trim: true,
    validator: {
      validator: validator.isURL,
      message: "{VALUE} is not a valid URL"
    }
  },
  bio: {
    type: String,
    text: true,
    trim: true
  },
  followedAuthors: [
    {
      _id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
      },
      name: {
        required: true,
        type: String,
        minLength: 6
      }
    }
  ]
});

UserSchema.methods.generateAuthToken = function() {
  const user = this;

  const token = jwt.sign(
    { _id: user._id.toHexString() },
    process.env.JWT_SECRET
  );
  user.token = token;
  return token;
};

UserSchema.statics.findByCredentials = function({ email, password }) {
  const User = this;

  return User.findOne({ email }).then(user => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          return resolve(user);
        } else {
          return reject();
        }
      });
    });
  });
};

UserSchema.statics.findByToken = function(token) {
  const User = this;

  return User.findOne({ token }).then(user => {
    if (!user) {
      return Promise.reject();
    } else {
      return Promise.resolve(user);
    }
  });
};

UserSchema.pre("save", function(next) {
  const user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
