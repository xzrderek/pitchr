var express = require('express');
var router = express.Router();
const passport = require('passport');
const { render } = require('../app');

router.get('/login', (req, res, next) => {
  const errors = req.flash().error || [];
  res.render('login', { errors });
});

router.post('/login', passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: '/login',
}), (req, res, next) => {
  res.redirect('create-post');
});

router.get('/register', (req, res, next) => {
  const flash = req.flash();
  const error = flash.error || [];
  const success = flash.success || [];

  res.render('register', { error, success });
});

router.post('/register', (req, res, next) => {
  const { username, password } = req.body;

  users
    .insertOne({ username, password })
    .then(() => {
      req.flash('success', 'User registered successfully');
      res.redirect('/register');
    })
    .catch(() => {
      req.flash('error', 'Error registering user');
      res.redirect('/register');
    });
});

module.exports = router;
