const expect = require("chai").expect;
const request = require("supertest");
const { ObjectID } = require("mongodb");

const app = require("../server");
const { User } = require("../models/user");
const { users, populateUsers } = require("./seed/seed");

describe("/auth", () => {
  beforeEach(function(done) {
    this.timeout(0);
    User.remove({}).then(() => done());
  });

  describe("POST /register", () => {
    it("should create a new user", function(done) {
      this.timeout(0);

      request(app)
        .post("/auth/register")
        .send(users[0])
        .expect(200)
        .expect(res => {
          expect(res.headers["token"]).to.be.a("string");
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
