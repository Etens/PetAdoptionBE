const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieMiddleware = require('../middlewares/cookie-middleware');
const database = require('../database');

// Handle request to the /login route
router.post('/', cookieMiddleware, async (req, res) => {
    console.log("Received a request to the /login route");
    try {
        // Connect to the database
        await database.connectDatabase();

        // Get the 'users' collection
        console.log("Connecting to the 'users' collection");
        const collection = mongoose.connection.collection('users');
        console.log("Connected to the 'users' collection");

        // Read the request body
        console.log("Reading request body");
        const { email, password } = req.body;

        // Validate the request body
        console.log("Validating request body");
        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        // Find the user in the database
        console.log("Finding user in the database");
        const user = await collection.findOne({ email });
        console.log("User found in the database");

        // Compare the password
        console.log("Comparing password");
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password compared");

        // Throw an error if the password is incorrect
        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        // Generate a token
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
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber
            }
        };
        // Send the token back to the client
        res.status(200).send(responseData);
    } catch (error) {
        console.error(error);
        res.status(400).send('An error occurred whle connecting to the database');
    }
});

module.exports = router;