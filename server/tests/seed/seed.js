const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");

const User = require("../../models/user");
const BlogPost = require("../../models/blogPost");

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [
  {
    _id: userOneID,
    email: "userone@gmail.com",
    username: "User One",
    password: "userone1",
    token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET).toString()
  },
  {
    _id: userTwoID,
    email: "usertwo@gmail.com",
    username: "User Two",
    password: "usertwo2",
    token: jwt.sign({ _id: userTwoID }, process.env.JWT_SECRET).toString()
  }
];

const populateUsers = done => {
  User.remove({})
    .then(() => {
      return User.insertMany(users);
    })
    .then(() => done());
};

const blogPosts = [
  {
    title: "Test 1",
    body: "This is a test",
    createdAt: 298342938,
    slug: slugify("Test 1")
  },
  {
    title: "Test 2",
    body: "This is also test",
    createdAt: 298342938,
    slug: slugify("Test 2")
  }
];

const populateBlogPosts = done => {
  BlogPost.remove({})
    .then(() => {
      return BlogPost.insertMany(blogPosts);
    })
    .then(() => done());
};

module.exports = {
  users,
  populateUsers,
  blogPosts,
  populateBlogPosts
};
