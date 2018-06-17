const express = require("express");
const _ = require("lodash");

const BlogPost = require("../models/blogPost");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/create", authenticate, (req, res) => {
  const body = req.body;
  const post = new BlogPost({
    ...body,
    createdAt: new Date(),
    author: {
      _id: req.user._id,
      name: req.user.username
    }
  });

  post
    .save()
    .then(doc => {
      res.send(
        _.pick(doc, ["author", "title", "body", "createdAt", "coverPhotoURL"])
      );
    })
    .catch(() => {
      res.status(400).send();
    });
});

module.exports = router;
