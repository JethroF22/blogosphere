const express = require("express");
const _ = require("lodash");
const slugify = require("slugify");

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
    },
    slug: slugify(body.title)
  });

  post
    .save()
    .then(doc => {
      res.send(
        _.pick(doc, [
          "author",
          "title",
          "body",
          "createdAt",
          "coverPhotoURL",
          "slug"
        ])
      );
    })
    .catch(err => {
      console.log(err);
      res.status(400).send();
    });
});

router.get("/view/:slug", (req, res) => {
  const slug = req.params.slug;

  BlogPost.findOne({ slug })
    .then(post => {
      if (!post) {
        return res.status(404).send();
      }

      res.send({ blogPost: post });
    })
    .catch(err => {
      res.status(400).send();
    });
});

module.exports = router;
