const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const db = require('./config/keys').MongoURI;
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// Passport Config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash Middleware
app.use(flash());

// DB Config
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDb connected...'))
  .catch(err => console.log(err));

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: false }));
app.use('/users', require('./routes/users'));

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));