const express = require('express');
const router = express.Router();

// Example: router.use('/auth', require('./auth'));
// Example: router.use('/users', require('./users'));
// Example: router.use('/trades', require('./trades'));
// Example: router.use('/ai', require('./ai'));

router.get('/', (req, res) => {
  res.send('Tympact API Root');
});

module.exports = router; 