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
    "token"
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
    "_id"
  ])
});

module.exports = {
  filterUserDocument,
  filterBlogPostDocument
};
