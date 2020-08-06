var express = require('express');
var router = express.Router();
const passport = require('passport');
const utils = require('../utils');
const ObjectID = require('mongodb').ObjectID;


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
    req.flash('success', 'Successfully signed up! You signed up as an investor. Nice to meet you ' + req.user.name)
    res.redirect('/iedit');
  }
  else {
    res.redirect('/posts');
  }
  //after registering, you are taken to the profile page, STILL NEED TO MAKE
});

// investor edit
router.get('/iedit', ensureAuthenticated, (req, res, next) => {
  const flash = req.flash();
  const error = flash.error || [];
  const success = flash.success || [];

  res.render('iedit', { error, success });
});

router.post('/iedit', (req, res, next) => {
  const { industry, give, background, image, website, experience, interests, location } = req.body;
  const investors = req.app.locals.investors;
  const name = req.user.name;
  const contact = req.user.email;
  const type = "investor";
  // console.log(username);
  // console.log(contact);
  // console.log(type);
  // console.log(req.body);
  // console.log(req.user);
  // const hashedPassword = utils.hashPassword(password);

  investors
    .insertOne({ industry, give, background, image, website, experience, interests, location, name: name, info: contact, type: type })
    .then(() => {
      req.flash('success', 'Profile successfully set up')
      res.redirect('/investors'); //now log in, never actually see the flash because taken to diff page
    })
    .catch(() => {
      req.flash('error', 'Error setting profile, try again!');
      res.redirect('/iedit');
    });
});

router.get('/investors', ensureAuthenticated, (req, res, next) => {
  const investors = req.app.locals.investors;

  investors
    .find({})
    .toArray()
    .then(investors => res.render('investors', { investors }));
});

router.get('/investors/:id', ensureAuthenticated, (req, res, next) => {
  const investors = req.app.locals.investors;
  const investorID = ObjectID(req.params.id);

  investors
    .find({ _id: investorID })
    .toArray()
    .then((investor) => {
      res.render('investor', { investor: investor[0] });
    })
});

router.get('/eedit', ensureAuthenticated, (req, res, next) => {
  const flash = req.flash();
  const error = flash.error || [];
  const success = flash.success || [];

  res.render('eedit', { error, success });
});

router.post('/eedit', (req, res, next) => {
  const { cname, cdescription, seek, industry, image, website, revenue, location } = req.body;
  const entrepreneurs = req.app.locals.entrepreneurs;
  const name = req.user.name;
  const contact = req.user.email;
  const type = "entrepreneur";
  // console.log(username);
  // console.log(contact);
  // console.log(type);
  // console.log(req.body);
  // console.log(req.user);
  // const hashedPassword = utils.hashPassword(password);

  entrepreneurs
    .insertOne({ cname, cdescription, seek, industry, image, website, revenue, location, author: name, info: contact, type: type })
    .then(() => {
      req.flash('success', 'Profile successfully set up')
      res.redirect('/entrepreneurs'); //now log in, never actually see the flash because taken to diff page
    })
    .catch(() => {
      req.flash('error', 'Error setting profile, try again!');
      res.redirect('/eedit');
    });
});

router.get('/entrepreneurs', ensureAuthenticated, (req, res, next) => {
  const entrepreneurs = req.app.locals.entrepreneurs;

  entrepreneurs
    .find({})
    .toArray()
    .then(entrepreneurs => res.render('entrepreneurs', { entrepreneurs }));
});

router.get('/entrepreneurs/:id', ensureAuthenticated, (req, res, next) => {
  const entrepreneurs = req.app.locals.entrepreneurs;
  const entrepreneurID = ObjectID(req.params.id);

  entrepreneurs
    .find({ _id: entrepreneurID })
    .toArray()
    .then((entrepreneur) => {
      res.render('entrepreneur', { entrepreneur: entrepreneur[0] });
    })
});

module.exports = router;