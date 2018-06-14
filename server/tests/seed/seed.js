const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

const { User } = require("../../models/user");

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
      return User.insertMany(user);
    })
    .then(done => done());
};

module.exports = {
  users,
  populateUsers
};
