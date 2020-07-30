var express = require('express');
var router = express.Router();
const passport = require('passport');
const ObjectID = require('mongodb').ObjectID;

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get('/create-post', (req, res, next) => {
    const flash = req.flash();
    const error = flash.error || [];
    const success = flash.success || [];

    res.render('create-post', { error, success })
});

router.post('/create-post', (req, res, next) => {
    const { title, content } = req.body;
    const username = req.user.username;
    const posts = req.app.locals.posts;
    const date = new Date().toISOString();
    posts
        .insertOne({ title, content, date, author: username })
        .then(() => {
            req.flash('success', 'Post registered successfully');
            res.redirect('/create-post');
        })
        .catch(() => {
            req.flash('error', 'We could not create the blog post');
            res.redirect('/create-post');
        });
});

router.get('/posts', (req, res, next) => {
    const posts = req.app.locals.posts;

    posts
        .find({})
        .toArray()
        .then(posts => res.render('posts', { posts }));
});

router.get('/posts/:id', (req, res, next) => {
    const posts = req.app.locals.posts;
    const postID = ObjectID(req.params.id);

    posts
        .find({ _id: postID })
        .then(post => res.render('post', { post }))
});

module.exports = router;