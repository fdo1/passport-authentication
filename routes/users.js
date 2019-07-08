const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  // Check passwords match
  if (password != password2) {
    errors.push({ msg: 'Passwords dont match' });
  }

  if (errors.length) {
    res.sendFile(path.join(__dirname, '../views/register.html'), {
      errors,
      name,
      email,
      password,
      password2
    })
  } else {
    User.findOne({ email: email })
      .then( user => {
        if (user) {
          errors.push({ msg: 'Email is already registered' })
          res.sendFile(path.join(__dirname, '../views/register.html'), {
            errors,
            name,
            email,
            password,
            password2
          })
        } else {
          const newUser = new User({
            name,
            email,
            password
          })
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user =>{
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/login.html');
                })
                .catch(err => console.log('Error when saving User: ', err));
            })
          })
        }
      });
  }
})

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/welcome.html',
    failureRedirect: '/login.html',
    failureFlash: true
  })(req, res, next);
})

module.exports = router;