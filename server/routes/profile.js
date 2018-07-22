const express = require("express");
const _ = require("lodash");
const { ObjectID } = require("mongodb");

const User = require("../models/user");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/create", authenticate, (req, res) => {
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

router.get("/:username", (req, res) => {
  User.findOne({ username: req.params.username })
    .then(user => {
      if (!user) {
        res.status(404).send("User not found");
      }

      res.send(
        _.pick(user, [
          "username",
          "bio",
          "photo",
          "followers",
          "followedAuthors",
          "likedPosts"
        ])
      );
    })
    .catch(err => res.status(400).send());
});

router.patch("/update/", authenticate, (req, res) => {
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
    {
      $push: {
        followers: follower,
        notifications: {
          message: `${req.user.username} followed you`
        }
      }
    },
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

router.delete("/unfollow", authenticate, (req, res) => {
  const author = _.pick(req.body, ["username", "_id"]);
  author._id = new ObjectID(author._id);
  const follower = { _id: req.user._id, username: req.user.username };

  User.findOneAndUpdate(
    { ...author, followers: { $in: [follower] } },
    { $pull: { followers: follower } },
    { new: true }
  )
    .then(user => {
      if (!user) {
        return res
          .status(404)
          .send({ msg: "this user is not currently following you" });
      }

      User.findOneAndUpdate(
        { username: req.user.username, followedAuthors: { $in: [author] } },
        { $pull: { followedAuthors: author } },
        { new: true }
      ).then(user => {
        if (!user) {
          return res
            .status(400)
            .send({ msg: "This author is not being followed" });
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
