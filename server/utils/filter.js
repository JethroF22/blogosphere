const _ = require("lodash");

const filterUserDocument = (user, additionalFields) => ({
  ..._.pick(user, [
    "email",
    "username",
    "photo",
    "bio",
    "followedAuthors",
    "followers",
    "_id",
    "likedPosts",
    "token",
    "notifications"
  ]),
  ...additionalFields
});

const filterBlogPostDocument = blogPost => ({
  ..._.pick(blogPost, [
    "title",
    "body",
    "coverPhotoURL",
    "createdAt",
    "updatedAt",
    "author",
    "slug",
    "likes",
    "_id",
    "comments"
  ])
});

module.exports = {
  filterUserDocument,
  filterBlogPostDocument
};
