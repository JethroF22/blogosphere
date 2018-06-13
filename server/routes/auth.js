const express = require("express");
const _ = require("lodash");

const { User } = require("../models/user");

const router = express.Router();

router.post("/register", (req, res) => {
  const credentials = _.pick(req.body, ["username", "password", "email"]);

  User.find({ email: credentials.email }).then(users => {
    if (users.length === 0) {
      const user = new User(credentials);
      const token = user.generateAuthToken();
      res.header("token", token).send(user);
    } else {
      res.status(400).send({ error: "Email already exists" });
    }
  });
});

module.exports = router;
