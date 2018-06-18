const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  body: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  coverPhotoURL: {
    type: String,
    trim: true,
    validator: {
      validator: validator.isURL,
      message: "{VALUE} is not a valid URL"
    }
  },
  createdAt: {
    type: Number,
    required: true
  },
  updatedAt: {
    type: Number
  },
  author: {
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
  slug: {
    type: String,
    required: true
  }
});

const BlogPost = mongoose.model("BlogPost", BlogPostSchema);

module.exports = BlogPost;
