//Authentication Middleware
const { User } = require('../models/User') ;

let auth = (req, res, next) => {
  //Get the token from the cookie on client
  let token = req.cookies.x_auth;
  console.log(token)

  //Decode Token with JWT
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true }) //To the client
    req.token = token;
    req.user = user;
    next();
  })
}

module.exports = { auth };

