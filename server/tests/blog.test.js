const expect = require("chai").expect;
const request = require("supertest");
const { ObjectID } = require("mongodb");

const app = require("../server");
const BlogPost = require("../models/blogPost");
const {
  users,
  populateUsers,
  blogPosts,
  populateBlogPosts
} = require("./seed/seed");

beforeEach(function(done) {
  this.timeout(0);
  BlogPost.remove({}).then(() => {
    populateUsers(done);
  });
});

describe("POST", () => {
  describe("/create", () => {
    it("should create a new post", function(done) {
      this.timeout(0);

      const post = blogPosts[0];

      request(app)
        .post("/blog/create")
        .set("token", users[0].token)
        .expect(200)
        .send(post)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          BlogPost.findOne({ title: post.title })
            .then(blogPost => {
              expect(blogPost.title).to.equal(post.title);
              expect(blogPost.body).to.equal(post.body);
              done();
            })
            .catch(err => done(err));
        });
    });
  });
});

describe("GET", () => {
  beforeEach(function(done) {
    this.timeout(0);
    populateBlogPosts(done);
  });

  describe(" /view/:slug", () => {
    it("should return a blog post", function(done) {
      this.timeout(0);

      const post = blogPosts[0];

      request(app)
        .get(`/blog/view/${post.slug}`)
        .expect(200)
        .expect(res => {
          expect(res.body.blogPost.body).to.equal(post.body);
          expect(res.body.blogPost.title).to.equal(post.title);
          expect(res.body.blogPost.slug).to.equal(post.slug);
        })
        .end(done);
    });

    it("should return 404 if no blog posts are found", done => {
      request(app)
        .get(`/blog/view/not-a-real-blog-post`)
        .expect(404)
        .end(done);
    });
  });

  describe("/view", () => {
    it("should return all blog posts", function(done) {
      this.timeout(0);

      request(app)
        .get("/blog/view")
        .expect(200)
        .expect(res => {
          expect(res.body.posts.length).to.equal(2);
        })
        .end(done);
    });
  });
});

describe("PATCH /edit/:slug", () => {
  let updates;

  beforeEach(function(done) {
    this.timeout(0);
    updates = { body: "This post has been edited" };
    populateBlogPosts(done);
  });

  it("should update a blog post", done => {
    request(app)
      .patch(`/blog/edit/${blogPosts[0].slug}`)
      .set("token", users[0].token)
      .send(updates)
      .expect(200)
      .expect(res => {
        expect(res.body.post.body).to.equal(updates.body);
      })
      .end(done);
  });

  it("should return 401 if token is invalid or non-existent", done => {
    request(app)
      .patch(`/blog/edit/${blogPosts[0].slug}`)
      .send(updates)
      .expect(401)
      .end(done);
  });

  it("should return 404 if post does not exists", done => {
    request(app)
      .patch("/blog/edit/does-not-exist")
      .set("token", users[0].token)
      .send(updates)
      .expect(404)
      .end(done);
  });
});
