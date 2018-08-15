const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");

const User = require("../../models/user");
const BlogPost = require("../../models/blogPost");

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const blogPostOneID = new ObjectID();

const users = [
  {
    _id: userOneID,
    email: "userone@gmail.com",
    username: "User One",
    password: "userone1",
    token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET).toString(),
    photo:
      "https://images.pexels.com/photos/982612/pexels-photo-982612.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    bio: "User 1 bio",
    notifications: [
      {
        message: 'User 2 has liked your post "Test 1"',
        timestamp: Date.now()
      }
    ]
  },
  {
    _id: userTwoID,
    email: "usertwo@gmail.com",
    username: "User Two",
    password: "usertwo2",
    token: jwt.sign({ _id: userTwoID }, process.env.JWT_SECRET).toString(),
    photo:
      "https://images.pexels.com/photos/908298/pexels-photo-908298.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    bio: "User 2 bio",
    followedAuthors: [{ username: "User One", _id: userOneID }],
    likedPosts: {
      title: "Test 1",
      slug: slugify("Test 1"),
      _id: blogPostOneID
    }
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
    slug: slugify("Test 1"),
    author: {
      _id: userOneID,
      username: users[0].username
    },
    _id: blogPostOneID,
    coverPhotoURL:
      "https://images.pexels.com/photos/982263/pexels-photo-982263.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  },
  {
    title: "Test 2",
    body: "This is also test",
    createdAt: 298342938,
    slug: slugify("Test 2"),
    author: {
      _id: userTwoID,
      username: users[1].username
    },
    coverPhotoURL:
      "https://images.pexels.com/photos/398533/pexels-photo-398533.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
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
