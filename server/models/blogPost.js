const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const { filterBlogPostDocument } = require("../utils/filter");

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
    },
    required: true
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
    },
    photo: {
      type: String,
      trim: true,
      validator: {
        validator: validator.isURL,
        message: "{VALUE} is not a valid URL"
      }
    }
  },
  slug: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [
    {
      username: {
        type: String,
        required: true
      },
      body: {
        type: String,
        required: true
      },
      timestamp: {
        type: Number,
        required: true
      }
    }
  ]
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
      posts = posts.map(post => filterBlogPostDocument(post));
      return resolve(posts);
    });
  });
};

const BlogPost = mongoose.model("BlogPost", BlogPostSchema);

module.exports = BlogPost;
