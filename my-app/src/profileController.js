const express = require('express');
const router = express.Router();
const { Profile } = require('../models');

router.get('/api/profiles', async (req, res) => {
  try {
    const profiles = await Profile.findAll();
    res.status(200).json(profiles);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/api/profiles', async (req, res) => {
  try {
    const { name, email, gender, age } = req.body;
    const newProfile = await Profile.create({ name, email, gender, age });
    res.status(201).json(newProfile);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
