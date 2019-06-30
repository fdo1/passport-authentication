const express = require('express');
const router = express.Router();
const path = require('path');

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
    res.send('Registered')
  }
})

module.exports = router;