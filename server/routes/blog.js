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
      let errorMsg;
      if (err.code === 11000) {
        errorMsg =
          "'Title' and 'Body' need to be unique values. No 2 posts with the same title or body can exist.";
      }
      res.status(400).send({ error: errorMsg });
    });
});

router.get("/view/:slug", (req, res) => {
  const slug = req.params.slug;

  BlogPost.findOne({ slug })
    .then(post => {
      if (!post) {
        return res.status(404).send();
      }

      const blogPost = _.pick(post, [
        "author",
        "title",
        "body",
        "createdAt",
        "coverPhotoURL",
        "slug"
      ]);

      blogPost.author = blogPost.author.name;

      res.send({ blogPost });
    })
    .catch(err => {
      res.status(400).send();
    });
});

router.get("/view", (req, res) => {
  BlogPost.find({}).then(docs => {
    const posts = [];
    docs.forEach(doc => {
      const blogPost = _.pick(doc, [
        "author",
        "title",
        "body",
        "createdAt",
        "coverPhotoURL",
        "slug"
      ]);
      blogPost.author = blogPost.author.name;
      posts.push(blogPost);
    });
    res.send({ posts });
  });
});

router.patch("/edit/:slug", authenticate, (req, res) => {
  const slug = req.params.slug;
  const updates = _.pick(req.body, ["body", "coverPhotoURL"]);
  updates["updatedAt"] = new Date();

  BlogPost.findOne({ slug })
    .then(post => {
      if (post) {
        BlogPost.findOneAndUpdate(
          { slug },
          { $set: updates },
          { new: true }
        ).then(post => {
          return res.send({ post });
        });
      } else {
        res.status(404).send("Post not found");
      }
    })
    .catch(error => {
      res.status(400).send();
    });
});

module.exports = router;
