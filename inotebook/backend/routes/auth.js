const express = require("express");
const router = express.Router();
const User = require("../models/User");
//create a User using: POST "/api/auth/createuser". Doesn't require Auth
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/createuser', async (req, res) => {
   try {
      console.log(req.body);
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
         name,
         email,
         password: hashedPassword
      });
      const createUser = await user.save();
      const token = jwt.sign({ userId: user._id }, 'secret_key');
      res.status(201).send({ user: createUser, token });
   } catch (error) {
      res.status(400).send(error);
      console.log(error);
   }
});

router.post('/login', async (req, res) => {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         return res.status(400).send({ error: "Please fill all the fields" });
      }
      // Check if user with given email exists
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(400).send({ error: "Invalid Credentials" });
      }
      // Compare the given password with the hashed password in the database
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
         return res.status(400).send({ error: "Invalid Credentials" });
      }
      // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, 'secret_key');
    // Send back the user object and the token
    res.json({ user, token });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;