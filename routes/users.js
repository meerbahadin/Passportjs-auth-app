const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');

// Load User model
const User = require('../models/User');


// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register
router.post('/register', forwardAuthenticated, (req, res) => {
  const {
    name,
    email,
    password,
    password2,
    role
  } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({
      message: 'Please enter all fields'
    });
  }

  if (password != password2) {
    errors.push({
      message: 'Passwords do not match'
    });
  }

  if (password.length < 6) {
    errors.push({
      message: 'Password must be at least 6 characters'
    });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      role,
      password,
      password2
    });
  } else {
    User.findOne({
      email: email
    }).then(user => {
      if (user) {
        errors.push({
          message: 'Email already exists'
        });
        res.render('register', {
          errors,
          name,
          email,
          role,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          role,
          password
        });

        //Hash password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash('success_msg', 'Your are now registered login now!')
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

//login
router.post('/login', forwardAuthenticated, (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
});

router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_msg', 'You Logged Out Succesfully');
  res.redirect('/users/login');
});



module.exports = router;