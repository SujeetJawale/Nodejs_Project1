var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postsModel = require("./posts");
const passport = require('passport');

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/profile',isLoggedIn, function(req, res, next) {
  res.render('profile');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.post("/register", function(req, res){
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/profile");
    })
  })
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login"
}), function(req, res){
});

router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

function isLoggedIn(req ,res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/login");
};

module.exports = router;
