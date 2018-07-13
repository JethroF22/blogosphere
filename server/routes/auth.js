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
  const user = _.pick(req.user, ["username", "email"]);
  res.send(user);
});

router.post("/profile", authenticate, (req, res) => {
  const data = _.pick(req.body, ["photo", "bio"]);
  const user = req.user;
  user.photo = data.photo;
  user.bio = data.bio;
  user
    .save()
    .then(user => {
      res.send(_.pick(user, ["photo", "bio"]));
    })
    .catch(err => {
      console.log(err);
      res.status(400).send();
    });
});

router.get("/profile/:username", (req, res) => {
  User.findOne({ username: req.params.username })
    .then(user => {
      if (!user) {
        res.status(404).send("User not found");
      }

      res.send(_.pick(user, ["username", "bio", "photo"]));
    })
    .catch(err => res.status(400).send());
});

router.patch("/profile/", authenticate, (req, res) => {
  const data = _.pick(req.body, ["photo", "bio"]);

  User.findOneAndUpdate(
    { username: req.user.username, email: req.user.email },
    { $set: data },
    { new: true }
  )
    .then(user => {
      user = _.pick(user, ["username", "bio", "photo", "email"]);
      res.send(user);
    })
    .catch(err => res.status(400).send("DB error"));
});

router.patch("/follow/", authenticate, (req, res) => {
  const author = _.pick(req.body, ["username", "_id"]);
  author._id = new ObjectID(author._id);
  const follower = {
    _id: req.user._id,
    username: req.user.username
  };

  User.findOneAndUpdate(
    { ...author, followers: { $nin: [follower] } },
    { $push: { followers: follower } },
    { new: true }
  )
    .then(user => {
      if (!user) {
        return res.status(404).send({ msg: "This user does not exist" });
      }

      User.findOneAndUpdate(
        { username: req.user.username, followedAuthors: { $nin: [author] } },
        { $push: { followedAuthors: author } },
        { new: true }
      ).then(user => {
        if (!user) {
          return res
            .status(400)
            .send({ msg: "This author is already being followed" });
        }

        res.send(
          _.pick(user, ["username", "bio", "photo", "email", "followedAuthors"])
        );
      });
    })
    .catch(() => {
      res.status(400).send({ msg: "DB error" });
    });
});

module.exports = router;
