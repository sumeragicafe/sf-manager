const express = require('express');
const router = express.Router();

// importing routes
const userRoutes = require('./userRoutes');

router.use('/users', userRoutes);
module.exports = router;
