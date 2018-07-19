const expect = require("chai").expect;
const request = require("supertest");
const { ObjectID } = require("mongodb");

const app = require("../server");
const User = require("../models/user");
const {
  users,
  populateUsers,
  blogPosts,
  populateBlogPosts
} = require("./seed/seed");

describe("profile", () => {
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
        .post("/profile/create")
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
        .post("/profile/create")
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
          .get(`/profile/${user.username}`)
          .expect(200)
          .expect(res => {
            expect(res.body.photo).to.equal(user.photo);
            expect(res.body.bio).to.equal(user.bio);
          })
          .end(done);
      });

      it("should return 404 if a user is not found", done => {
        request(app)
          .get("/profile/NonExistentUser")
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

    it("should update a user's profile", done => {
      request(app)
        .patch(`/profile/update`)
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
        .patch(`/profile/update`)
        .send(updates)
        .expect(401)
        .end(done);
    });
  });

  describe("/follow", () => {
    beforeEach(function(done) {
      this.timeout(0);
      populateUsers(done);
    });

    describe("PATCH", () => {
      it("should add the author to the list of followed authors", done => {
        const user = users[0];

        request(app)
          .patch("/profile/follow")
          .set("token", user.token)
          .send(users[1])
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            User.findOne({ username: user.username })
              .then(user => {
                expect(user.followedAuthors.length).to.equal(1);
                done();
              })
              .catch(err => done(err));
          });
      });

      it("should return 400 if author is already being followed", done => {
        const user = users[1];

        request(app)
          .patch("/profile/follow")
          .set("token", user.token)
          .send(users[0])
          .expect(400)
          .end(done);
      });

      it("should return 404 when trying to follow non-existent users", done => {
        const user = {
          username: "Random",
          _id: new ObjectID()
        };

        request(app)
          .patch("/profile/follow")
          .set("token", users[0].token)
          .send(user)
          .expect(404)
          .end(done);
      });
    });
  });
});
