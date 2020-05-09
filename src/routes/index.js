import express from 'express';

import auth from './auth.routes';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Geo Photos API - 👋'
  });
});

router.use('/auth', auth);

module.exports = router;
