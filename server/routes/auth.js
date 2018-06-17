const express = require("express");
const _ = require("lodash");

const User = require("../models/user");

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
    .catch(error => {
      res.status(400).send({ error });
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
    .catch(err => res.status(400).send());
});

module.exports = router;
