const express = require("express");
const _ = require("lodash");

const { User } = require("../models/user");

const router = express.Router();

router.post("/register", (req, res) => {
  const credentials = _.pick(req.body, ["username", "password", "email"]);

  const user = new User(credentials);
  const token = user.generateAuthToken();
  const responseObject = {
    token,
    username: credentials.username,
    email: credentials.email
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

module.exports = router;
