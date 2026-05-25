// auth middleware

const jwt = require("jsonwebtoken");

const isLoggedin = (req, res, next) => {
  if (!req.cookies.token) {
    return res.redirect("/login");
  }
  try {
    let data = jwt.verify(req.cookies.token, "ConfidentialKey");
    req.user = data;
    next();
  } catch (err) {
    res.redirect("/login");
  }
};

module.exports = isLoggedin;
