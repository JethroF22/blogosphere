const expect = require("chai").expect;
const request = require("supertest");

const app = require("../server");
const User = require("../models/user");
const { users } = require("./seed/seed");

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
});
