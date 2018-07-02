const express = require("express");
const _ = require("lodash");

const Profile = require("../models/profile.js");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/create", authenticate, (req, res) => {
  console.log(req.user);
  const body = req.body;
  const profile = new Profile({
    ...body,
    numFollowers: 0,
    createdAt: new Date(),
    user: {
      _id: req.user._id,
      name: req.user.username
    }
  });

  profile
    .save()
    .then(profile => {
      res.send(
        _.pick(profile, [
          "user",
          "photo",
          "following",
          "createdAt",
          "numFollowers"
        ])
      );
    })
    .catch(err => {
      console.log(err);
      res.status(400).send();
    });
});

module.exports = router;
