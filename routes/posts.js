var express = require('express');
var router = express.Router();
const passport = require('passport');
const ObjectID = require('mongodb').ObjectID;

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/register');
};

router.get('/create-post', ensureAuthenticated, (req, res, next) => {
    const flash = req.flash();
    const error = flash.error || [];
    const success = flash.success || [];

    res.render('create-post', { error, success });
});

router.post('/create-post', (req, res, next) => {
    const { title, time, eventdate, image, meet, content } = req.body;
    const username = req.user.username;
    const posts = req.app.locals.posts;
    const date = new Date().toISOString();
    // console.log(req.body);
    // console.log(req.user);
    posts
        .insertOne({ title, eventdate, time, image, content, meet, date, author: username })
        .then(() => {
            req.flash('success', 'Post registered successfully');
            res.redirect('/posts');
        })
        .catch(() => {
            req.flash('error', 'We could not create the blog post');
            res.redirect('/create-post');
        });
});

router.get('/posts', ensureAuthenticated, (req, res, next) => {
    const posts = req.app.locals.posts;

    posts
        .find({})
        .toArray()
        .then(posts => res.render('posts', { posts }));
});


router.get('/posts/:id', ensureAuthenticated, (req, res, next) => {
    const posts = req.app.locals.posts;
    const postID = ObjectID(req.params.id);

    posts
        .find({ _id: postID })
        .toArray()
        .then((post) => {
            res.render('post', { post: post[0] });
        })
});

module.exports = router;
