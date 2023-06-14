const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const database = require('../database');
const checkConfirmPasswordMiddleware = require('../middlewares/checkConfirmPasswordMiddleware');
const cookieMiddleware = require('../middlewares/cookie-middleware');

// Handle request to the /signup route and use the checkPasswordMiddleware
router.post('/', checkConfirmPasswordMiddleware, cookieMiddleware, async (req, res) => {
  console.log("Received a request to the /signup route");
  try {
    // Connect to the database 
    await database.connectDatabase();

    // Get the 'users' collection
    console.log("Connecting to the 'users' collection");
    const collection = mongoose.connection.collection('users');
    console.log("Connected to the 'users' collection");

    // Read the request body
    console.log("Reading request body");
    const { email, password, confirmPassword, firstName, lastName, phoneNumber } = req.body;

    // Create a new User object
    console.log("Creating user object");
    const user = new User({
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phoneNumber
    });

    // Validate the User object
    console.log("Validating user object");
    await user.validate();

    // Insert the user into the database
    console.log("Inserting user into the database");
    await collection.insertOne(user);
    console.log("User successfully inserted into the database");

    console.log("Generating token");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 3600
    });
    console.log("Token generated");

    // Create the response data object
    const responseData = {
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      },
    }

    // Send the result back to the client
    res.send(responseData);
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.log(error);
      return res.status(400).send(error.message);
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      console.log(error);
      return res.status(400).send('Email already exists');
    } else {
      console.log(error);
      res.status(400).send('An error occurred whle connecting to the database');
    }
  } finally {
    // Close the database connection
    await database.closeDatabase();
  }
});

module.exports = router;