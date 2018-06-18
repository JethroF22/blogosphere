const expect = require("chai").expect;
const request = require("supertest");
const { ObjectID } = require("mongodb");

const app = require("../server");
const User = require("../models/user");
const BlogPost = require("../models/blogPost");
const {
  users,
  populateUsers,
  blogPosts,
  populateBlogPosts
} = require("./seed/seed");

describe("/auth", () => {
  describe("POST /register", () => {
    beforeEach(function(done) {
      this.timeout(0);
      User.remove({}).then(() => done());
    });

    it("should create a new user", function(done) {
      this.timeout(0);

      request(app)
        .post("/auth/register")
        .send(users[0])
        .expect(200)
        .expect(res => {
          expect(res.body.token).to.be.a("string");
          expect(res.body.username).to.equal(users[0].username);
          expect(res.body.email).to.equal(users[0].email);
        })
        .end(err => {
          if (err) {
            return done(err);
          }

          User.findOne({ email: users[0].email })
            .then(user => {
              expect(user.password).to.not.equal(users[0].password);
              done();
            })
            .catch(err => done(err));
        });
    });

    it("should return vaildation errors for invalid requests", done => {
      const email = "invalidemail";
      const password = "short";

      request(app)
        .post("/auth/register")
        .send({ email })
        .expect(400)
        .expect(res => {
          expect(res.error.errors).to.have.property("username");
          expect(res.error.errors).to.have.property("password");
          expect(res.error.errors).to.have.property("email");
        })
        .end(() => done());
    });
  });
});

describe("/blog", () => {
  beforeEach(function(done) {
    this.timeout(0);
    BlogPost.remove({}).then(() => {
      populateUsers(done);
    });
  });

  describe("POST /create", () => {
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

  describe("GET /view/:slug", () => {
    beforeEach(function(done) {
      this.timeout(0);
      populateBlogPosts(done);
    });

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
});
