var express = require('express');
var router = express.Router();

/* GET profile page. */
router.get('/profile', function (req, res, next) {
  res.render('profile', { title: 'Express' });
});

module.exports = router;