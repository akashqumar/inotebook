const express = require("express");
const router = express.Router();
const User = require("../models/User");
//create a User using: POST "/api/auth/createuser". Doesn't require Auth
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const secret_key = 'SfBrweENW2A5VS703';
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
      const token = jwt.sign({ userId: user._id }, secret_key);
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
    const token = jwt.sign({ userId: user._id }, secret_key);
    // Send back the user object and the token
    res.json({ user, token });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user details using: POST "/api/auth/getuser". Requires Auth
router.post('/getuser', fetchuser, async (req, res) => {
   try {
      // console.log(req.user.userId);
     if (!req.user) {
       return res.status(401).send({ error: 'Unauthorized' });
     }
     const user = await User.findById(req.user).select('-password');
     console.log("i am from auth",req.user);
     if (!user) {
       return res.status(404).send({ error: 'User not found' });
     }
     res.send(user);
   } catch (error) {
     console.error(error);
     res.status(500).send({ error: 'Server error' });
   }
 });

module.exports = router;