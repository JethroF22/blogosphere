const express = require("express");
const _ = require("lodash");
const slugify = require("slugify");
const { ObjectID } = require("mongodb");

const BlogPost = require("../models/blogPost");
const User = require("../models/user");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/create", authenticate, (req, res) => {
  const body = req.body;
  const post = new BlogPost({
    ...body,
    createdAt: new Date(),
    author: {
      _id: req.user._id,
      username: req.user.username
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
          "slug",
          "_id"
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
        "slug",
        "_id"
      ]);

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
        "slug",
        "_id"
      ]);
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

router.patch("/like/", authenticate, (req, res) => {
  const post = _.pick(req.body, ["_id", "slug", "title", "author"]);
  post._id = new ObjectID(post._id);

  User.findOne({
    $and: [
      {
        username: req.user.username
      },
      {
        username: {
          $ne: post.author.username
        }
      }
    ],
    likedArticles: { $nin: [post] }
  }).then(user => {
    if (!user) {
      const msg =
        post.author.username === req.user.username
          ? "Users cannot like their own content"
          : "This article has already been 'liked'";
      return res.status(400).send({ msg });
    }
    BlogPost.findOneAndUpdate(
      { slug: post.slug },
      { $inc: { likes: 1 } },
      { new: true }
    )
      .then(post => {
        if (!post) {
          return res.status(404).send({ msg: "Article not found" });
        }
        user.likedArticles.concat(_.pick(post, ["_id", "title", "slug"]));

        user
          .save()
          .then(user =>
            res.send(
              _.pick(user, [
                "email",
                "username",
                "photo",
                "bio",
                "followedAuthors",
                "followers",
                "likedArticles"
              ])
            )
          );
      })
      .catch(err => res.status(400).send());
  });
});

module.exports = router;
