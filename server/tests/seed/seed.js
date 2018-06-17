const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const User = require("../../models/user");

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
    createdAt: 298342938
  },
  {
    title: "Test 2",
    body: "This is also test",
    createdAt: 298342938
  },
  {
    title: "Invalid Post",
    createdAt: null,
    body: 12932
  }
];

module.exports = {
  users,
  populateUsers,
  blogPosts
};
