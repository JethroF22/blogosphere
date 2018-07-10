const expect = require("chai").expect;
const request = require("supertest");
const { ObjectID } = require("mongodb");

const app = require("../server");
const User = require("../models/user");
const { users, populateUsers } = require("./seed/seed");

describe("/auth", () => {
  describe("/register", () => {
    beforeEach(function(done) {
      this.timeout(0);
      User.remove({}).then(() => done());
    });

    describe("POST", () => {
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

  describe("/profile", () => {
    let photo, bio;

    beforeEach(function(done) {
      this.timeout(0);
      photo =
        "https://images.pexels.com/photos/1020323/pexels-photo-1020323.jpeg?auto=compress&cs=tinysrgb&h=650&w=940";
      bio = "This is test user's bio";
      populateUsers(done);
    });

    describe("POST", () => {
      it("updates the user's details", done => {
        request(app)
          .post("/auth/profile")
          .set("token", users[0].token)
          .send({
            photo,
            bio
          })
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            User.findOne({ photo, bio })
              .then(user => {
                expect(user.photo).to.equal(photo);
                expect(user.bio).to.equal(bio);
                done();
              })
              .catch(err => done(err));
          });
      });

      it("returns a 401 for requests without tokens", done => {
        request(app)
          .post("/auth/profile")
          .send({ photo, bio })
          .expect(401)
          .end(done);
      });
    });

    describe("GET", () => {
      describe("/:username", () => {
        it("fetches the user's profile", done => {
          const user = users[0];

          request(app)
            .get(`/auth/profile/${user.username}`)
            .expect(200)
            .expect(res => {
              expect(res.body.photo).to.equal(user.photo);
              expect(res.body.bio).to.equal(user.bio);
            })
            .end(done);
        });

        it("should return 404 if a user is not found", done => {
          request(app)
            .get("/auth/profile/NonExistentUser")
            .expect(404)
            .end(done);
        });
      });
    });

    describe("PATCH ", () => {
      let updates = {
        photo:
          "https://images.pexels.com/photos/566040/pexels-photo-566040.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
        bio: "Updated bio"
      };
      let user = users[0];

      describe("/:username", () => {
        it("should update a user's profile", done => {
          request(app)
            .patch(`/auth/profile/`)
            .set("token", user.token)
            .send(updates)
            .expect(200)
            .expect(res => {
              expect(res.body.photo).to.equal(updates.photo);
              expect(res.body.bio).to.equal(updates.bio);
            })
            .end(done);
        });

        it("should return 401 if token is invalid or non-existent", done => {
          request(app)
            .patch(`/auth/profile/`)
            .send(updates)
            .expect(401)
            .end(done);
        });
      });
    });
  });
});
