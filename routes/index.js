var express = require('express');
var router = express.Router();

const User = require('../models/user');
const passport = require('passport');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Kapil Search', user: req.user });
});

router.get('/login', (req, res, next) => {
  let messages = req.session.messages || [];
  req.session.messages = [];
  res.render('login', { title: 'Login to your Account', messages: messages });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/books',
  failureRedirect: '/login',
  failureMessage: 'Invalid Credentials'
}));

router.get('/register', (req, res, next) => {
  res.render('register', { title: "Create a new Account" });
});

router.post('/register', (req, res, next) => {
  User.register(
    new User({
      username: req.body.username
    }),
    req.body.password,
    (err, newUser) => {
      if (err) {
        console.log(err);
        return res.redirect('/register');
      }
      else {
        req.login(newUser, (err) => {
          res.redirect('/books');
        });
      }
    });
});

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login');
});


router.get('/github', passport.authenticate('github', { scope: ["user.email"] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login'}),
  (req, res, next) => {
    res.redirect('/books');
  }
);


module.exports = router;
