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
    unique: true,
    text: true
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
    username: {
      required: true,
      type: String,
      minLength: 6
    }
  },
  slug: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  }
});

BlogPostSchema.statics.findPostsByAuthors = function(authors) {
  const BlogPost = this;
  authors = authors.map(author => author.username);

  return new Promise((resolve, reject) => {
    BlogPost.find({
      "author.username": {
        $in: authors
      }
    }).then(posts => {
      return resolve(posts);
    });
  });
};

const BlogPost = mongoose.model("BlogPost", BlogPostSchema);

module.exports = BlogPost;
