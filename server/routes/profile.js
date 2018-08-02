const express = require("express");
const _ = require("lodash");
const { ObjectID } = require("mongodb");

const User = require("../models/user");
const BlogPost = require("../models/blogPost");
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
      res.status(400).send();
    });
});

router.get("/:username", (req, res) => {
  User.findOne({ username: req.params.username })
    .then(user => {
      if (!user) {
        res.status(404).send("User not found");
      }
      BlogPost.findPostsByAuthors(user.followedAuthors).then(
        postsByFollowedAuthors => {
          res.send({
            user: {
              ..._.pick(user, [
                "username",
                "bio",
                "photo",
                "followers",
                "followedAuthors",
                "likedPosts"
              ]),
              postsByFollowedAuthors
            }
          });
        }
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
          message: `${req.user.username} followed you`,
          timestamp: new Date()
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

        const postsByFollowedAuthors = BlogPost.findPostsByAuthors(
          user.followedAuthors
        );

        res.send({
          user: {
            ..._.pick(user, [
              "username",
              "bio",
              "photo",
              "email",
              "followedAuthors",
              "likedPosts",
              "followers"
            ]),
            postsByFollowedAuthors
          }
        });
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

        const postsByFollowedAuthors = BlogPost.findPostsByAuthors(
          user.followedAuthors
        );

        res.send({
          user: {
            ..._.pick(user, [
              "username",
              "bio",
              "photo",
              "email",
              "followedAuthors",
              "likedPosts",
              "followers"
            ]),
            postsByFollowedAuthors
          }
        });
      });
    })
    .catch(() => {
      res.status(400).send({ msg: "DB error" });
    });
});

router.get("/posts/:author", (req, res) => {
  const author = req.params.author;

  BlogPost.find({ "author.username": author })
    .then(posts => {
      if (!posts) {
        return res
          .status(404)
          .send({ msg: "This user has not published any posts" });
      }

      res.send({ posts });
    })
    .catch(err => {
      res.status(400).send({ error });
    });
});

module.exports = router;
