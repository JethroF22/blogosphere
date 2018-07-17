const express = require("express");
const _ = require("lodash");
const { ObjectID } = require("mongodb");

const User = require("../models/user");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/register", (req, res) => {
  const credentials = _.pick(req.body, ["username", "password", "email"]);

  const user = new User(credentials);
  const token = user.generateAuthToken();
  const responseObject = {
    token,
    username: user.username,
    email: user.email
  };
  user
    .save()
    .then(() => {
      res.send(responseObject);
    })
    .catch(err => {
      let errorMsg;
      if (err.code === 11000) {
        errorMsg = "Email already in use";
      }
      res.status(400).send(errorMsg);
    });
});

router.post("/login", (req, res) => {
  const credentials = _.pick(req.body, ["password", "email"]);

  User.findByCredentials({ ...credentials })
    .then(user => {
      res.send({
        token: user.token,
        username: user.username,
        email: user.email
      });
    })
    .catch(() => {
      res.status(400).send("Invalid email/password combination");
    });
});

router.get("/user_details", authenticate, (req, res) => {
  const user = _.pick(
    req.user,
    "email",
    "username",
    "photo",
    "bio",
    "followedAuthors",
    "followers",
    "_id"
  );
  res.send(user);
});

module.exports = router;
