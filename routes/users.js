var express = require('express');
var router = express.Router();
const passport = require('passport');
const utils = require('../utils')

router.get('/register', (req, res, next) => {
  const flash = req.flash();
  const error = flash.error || [];
  const success = flash.success || [];

  res.render('register', { error, success });
});

router.post('/register', (req, res, next) => {
  const { name, email, type, username, password } = req.body;
  const users = req.app.locals.users;
  const hashedPassword = utils.hashPassword(password);

  users
    .insertOne({ name, email, type, username, password: hashedPassword })
    .then(() => {
      req.flash('success', 'Successfully signed up! Nice to meet you ' + req.body.name)
      res.redirect('/register'); //now log in, never actually see the flash because taken to diff page
    })
    .catch(() => {
      req.flash('error', 'Error registering user, try again!');
      res.redirect('/register');
    });
});

router.get('/login', (req, res, next) => {
  const errors = req.flash().error || [];
  res.render('login', { errors });
});

router.post('/login', passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/register',
}), (req, res, next) => {
  res.redirect('/posts'); //after registering, you are taken to the profile page, STILL NEED TO MAKE
});

module.exports = router;