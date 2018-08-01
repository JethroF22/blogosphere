const express = require("express");
const _ = require("lodash");
const { ObjectID } = require("mongodb");

const User = require("../models/user");
const BlogPost = require("../models/blogPost");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/register", (req, res) => {
  const credentials = _.pick(req.body, ["username", "password", "email"]);

  const user = new User(credentials);
  const token = user.generateAuthToken();
  user
    .save()
    .then(() => {
      res.send({
        user: {
          ..._.pick(
            user,
            "email",
            "username",
            "photo",
            "bio",
            "followedAuthors",
            "followers",
            "_id",
            "likedPosts",
            "token"
          )
        }
      });
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
      BlogPost.findPostsByAuthors(user.followedAuthors).then(
        postsByFollowedAuthors => {
          res.send({
            user: {
              ..._.pick(
                user,
                "email",
                "username",
                "photo",
                "bio",
                "followedAuthors",
                "followers",
                "_id",
                "likedPosts",
                "token"
              ),
              postsByFollowedAuthors
            }
          });
        }
      );
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
    "_id",
    "likedPosts"
  );
  BlogPost.findPostsByAuthors(user.followedAuthors).then(
    postsByFollowedAuthors =>
      res.send({ user: { ...user, postsByFollowedAuthors } })
  );
});

module.exports = router;
