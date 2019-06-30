const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const db = require('./config/keys').MongoURI;

// DB Config
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDb connected...'))
  .catch(err => console.log(err));

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: false }));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));