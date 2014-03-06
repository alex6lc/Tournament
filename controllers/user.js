var passport = require('passport');
var _ = require('underscore');
var User = require('../models/User');

/**
 * POST /login
 * Sign in using email and password.
 */

exports.postLogin = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        return res.json({
            status: 0,
            errors: errors
        });
    }

    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);
        if (!user) {
            return res.json({
                status: 0,
                msg: info.message
            });
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.json({
                status: 1
            });
            //res.redirect(req.session.lastUrl || '/');
        });
    })(req, res, next);
};

/**
 * POST /signup
 * Create a new local account.
 */

exports.postSignup = function(req, res, next) {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        return res.json({
            status: 0,
            errors: errors
        });
    }

    var user = new User({
        email: req.body.email,
        password: req.body.password
    });

    user.save(function(err) {
        if (err) {
            if (err.code === 11000) {
                return res.json({
                    status: 0,
                    msg: 'User with that email already exists.'
                });
            }
            return res.json({
                status: 0
            });
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.json({
                status: 1
            });
        });
    });
};

/**
 * GET /account
 * Profile page.
 */

exports.getAccount = function(req, res) {
    res.render('account/profile', {
        title: 'Account Management'
    });
};

/**
 * POST /account/profile
 * Update profile information.
 */

exports.postUpdateProfile = function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);
        user.email = req.body.email || '';
        user.profile.name = req.body.name || '';
        user.profile.gender = req.body.gender || '';
        user.profile.location = req.body.location || '';
        user.profile.website = req.body.website || '';

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', { msg: 'Profile information updated.' });
            res.redirect('/account');
        });
    });
};

/**
 * POST /account/password
 * Update current password.
 * @param password
 */

exports.postUpdatePassword = function(req, res, next) {
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors);
        return res.redirect('/account');
    }

    User.findById(req.user.id, function(err, user) {
        if (err) return next(err);

        user.password = req.body.password;

        user.save(function(err) {
            if (err) return next(err);
            req.flash('success', { msg: 'Password has been changed.' });
            res.redirect('/account');
        });
    });
};

/**
 * POST /account/delete
 * Delete user account.
 * @param id - User ObjectId
 */

exports.postDeleteAccount = function(req, res, next) {
    User.remove({ _id: req.user.id }, function(err) {
        if (err) return next(err);
        req.logout();
        res.redirect('/');
    });
};