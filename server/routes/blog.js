const express = require("express");
const _ = require("lodash");
const slugify = require("slugify");
const { ObjectID } = require("mongodb");

const BlogPost = require("../models/blogPost");
const User = require("../models/user");
const authenticate = require("../middleware/authenticate");
const { filterBlogPostDocument } = require("../utils/filter");

const router = express.Router();

router.post("/create", authenticate, (req, res) => {
  const body = req.body;
  const author = {
    _id: req.user._id,
    username: req.user.username
  };
  if (req.user.photo) author.photo = req.user.photo;
  const post = new BlogPost({
    ...body,
    createdAt: new Date(),
    author,
    slug: slugify(body.title)
  });

  post
    .save()
    .then(post => {
      post = filterBlogPostDocument(post);
      res.send({ post });
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

      post = filterBlogPostDocument(post);

      res.send({ post });
    })
    .catch(err => {
      res.status(400).send();
    });
});

router.get("/view", (req, res) => {
  BlogPost.find({}).then(docs => {
    const posts = [];
    docs.forEach(post => {
      post = filterBlogPostDocument(post);
      posts.push(post);
    });
    res.send({ posts });
  });
});

router.patch("/edit/:slug", authenticate, (req, res) => {
  const slug = req.params.slug;
  const updates = _.pick(req.body, ["body", "coverPhotoURL"]);
  updates["updatedAt"] = new Date();

  BlogPost.findOneAndUpdate({ slug }, { $set: updates }, { new: true })
    .then(post => {
      if (!post) {
        return res.status(404).send("Post not found");
      }

      post = filterBlogPostDocument(post);

      return res.send({ post });
    })
    .catch(error => {
      res.status(400).send();
    });
});

router.patch("/like/", authenticate, (req, res) => {
  const post = _.pick(req.body, ["_id", "title", "slug"]);
  const postAuthor = req.body.author;
  post._id = new ObjectID(post._id);

  User.findOne({
    $and: [
      {
        username: req.user.username
      },
      {
        username: {
          $ne: postAuthor.username
        }
      }
    ]
  }).then(user => {
    if (!user) {
      return res
        .status(400)
        .send({ msg: "Users cannot like their own content" });
    }

    let exists = false;
    user.likedPosts.forEach(likedPost => {
      if (likedPost.title === post.title) {
        exists = true;
      }
    });

    if (exists) {
      return res.status(400).send({ msg: "This post has already been liked" });
    }

    BlogPost.findOneAndUpdate(
      { slug: post.slug },
      { $inc: { likes: 1 } },
      { new: true }
    )
      .then(post => {
        if (!post) {
          return res.status(404).send({ msg: "Post not found" });
        }
        post = filterBlogPostDocument(post);
        User.likePost(req.user, postAuthor, post).then(user =>
          res.status(200).send()
        );
      })
      .catch(err => res.status(400).send());
  });
});

router.patch("/unlike/", authenticate, (req, res) => {
  const post = _.pick(req.body, ["_id", "title", "slug"]);
  const postAuthor = req.body.author;
  post._id = new ObjectID(post._id);

  User.findOne({
    $and: [
      {
        username: req.user.username
      }
    ]
  }).then(user => {
    let exists = false;
    user.likedPosts.forEach(likedPost => {
      if (likedPost.title === post.title) {
        exists = true;
      }
    });

    if (!exists) {
      return res
        .status(400)
        .send({ msg: "This post has not been liked by this user" });
    }

    BlogPost.findOneAndUpdate(
      { slug: post.slug },
      { $inc: { likes: -1 } },
      { new: true }
    )
      .then(post => {
        if (!post) {
          return res.status(404).send({ msg: "Post not found" });
        }
        user.unlikePost(post).then(() => res.status(200).send());
      })
      .catch(err => res.status(400).send());
  });
});

router.patch("/comment", authenticate, (req, res) => {
  const { _id, commentBody } = _.pick(req.body, ["_id", "commentBody"]);
  const username = req.user.username;

  BlogPost.findOneAndUpdate(
    { _id },
    {
      $push: {
        comments: {
          username,
          body: commentBody,
          timestamp: new Date()
        }
      }
    },
    { new: true }
  )
    .then(post => {
      if (!post) {
        return res.status(404).send({ msg: "Post does not exist" });
      }
      post = filterBlogPostDocument(post);
      res.send({ post });
    })
    .catch(err => res.status(400).send());
});

module.exports = router;
