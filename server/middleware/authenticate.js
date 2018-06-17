const { User } = require("../models/user");

const authenticate = (req, res, next) => {
  const token = req.header("token");

  if (token) {
    User.findByToken(token)
      .then(user => {
        if (!user) {
          return Promise.reject();
        }

        req.user = user;
        next();
      })
      .catch(error => {
        res.status.send(401);
      });
  }
};
