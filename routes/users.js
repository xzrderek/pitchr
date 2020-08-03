var express = require('express');
var router = express.Router();
const passport = require('passport');
const utils = require('../utils')

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/register');
};

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
  const usertype = req.user.type;
  // console.log(usertype);
  // console.log(req.user);
  // console.log(usertype == ("entrepreneur"))
  if (usertype == ("entrepreneur")) {
    req.flash('success', 'Successfully signed up! You signed up as an entrepreneur. Nice to meet you ' + req.user.name)
    res.redirect('/eedit');
  }
  else if (usertype == ("investor")) {
    req.flash('success', 'Successfully signed up! You signed up as an investor. Nice to meet you ' + req.body.name)
    res.redirect('/iedit');
  }
  else {
    res.redirect('/posts');
  }
  //after registering, you are taken to the profile page, STILL NEED TO MAKE
});

// investor edit
router.get('/iedit', (req, res, next) => {
  const flash = req.flash();
  const error = flash.error || [];
  const success = flash.success || [];

  res.render('iedit', { error, success });
});

router.post('/iedit', (req, res, next) => {
  const { companyname, companydescription, type, username, password } = req.body;
  const users = req.app.locals.users;
  const hashedPassword = utils.hashPassword(password);

  users
    .insertOne({})
    .then(() => {
      req.flash('success', 'Successfully logged in! Nice to meet you ' + req.body.username)
      res.redirect('/iedit'); //now log in, never actually see the flash because taken to diff page
    })
    .catch(() => {
      req.flash('error', 'Error registering user, try again!');
      res.redirect('/iedit');
    });
});

// entrepreneur edit
router.get('/eedit', ensureAuthenticated, (req, res, next) => {
  const flash = req.flash();
  const error = flash.error || [];
  const success = flash.success || [];

  res.render('eedit', { error, success });
});

router.post('/eedit', (req, res, next) => {
  const { cname, cdescription, seek, industry, image, website, revenue, location } = req.body;
  const entrepreneurs = req.app.locals.entrepreneurs;
  const username = req.user.username;
  const contact = req.user.email;
  const type = "entrepreneur";
  console.log(username);
  console.log(contact);
  console.log(type);
  console.log(req.body);
  console.log(req.user);
  // const hashedPassword = utils.hashPassword(password);

  entrepreneurs
    .insertOne({ cname, cdescription, seek, industry, image, website, revenue, location, author: username, info: contact , type: type})
    .then(() => {
      req.flash('success', 'Profile successfully set up')
      res.redirect('/'); //now log in, never actually see the flash because taken to diff page
    })
    .catch(() => {
      req.flash('error', 'Error setting profile, try again!');
      res.redirect('/eedit');
    });
});

router.get('/entrepreneurs', (req, res, next) => {
  const entrepreneurs = req.app.locals.entrepreneurs;

  entrepreneurs
      .find({})
      .toArray()
      .then(entrepreneurs => res.render('entrepreneurs', { entrepreneurs }));
});

router.get('/entrepreneurs/:id', (req, res, next) => {
  const entrepreneurs = req.app.locals.entrepreneurs;
  const entrepreneursID = ObjectID(req.params.id);

  entrepreneurs
      .find({ _id: entrepreneursID })
      .toArray()
      .then((entrepreneurs) => {
          res.render('entrepreneurs', { entrepreneurs: entrepreneurs[0] });
      })
});

module.exports = router;