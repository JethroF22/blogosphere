const mongoose = require("mongoose");
const validator = require("validator");

const ProfileSchema = new mongoose.Schema({
  user: {
    _id: {
      required: true,
      type: mongoose.Schema.Types.ObjectId
    },
    name: {
      required: true,
      type: String,
      minLength: 6
    }
  },
  photo: {
    required: true,
    type: String,
    trim: true,
    validator: {
      validator: validator.isURL,
      message: "{VALUE} is not a valid URL"
    }
  },
  following: [
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
  ],
  numFollowers: {
    type: Number
  },
  createdAt: {
    type: Number,
    required: true
  }
});

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;
