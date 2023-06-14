const express = require('express');
const router = express.Router();
const User = require('../models/User');
const database = require('../database');

const checkConfirmPasswordMiddleware = require('../middlewares/checkConfirmPasswordMiddleware');
const checkRoleAdminMiddleware = require('../middlewares/checkRoleAdminMiddleware');
const cookieMiddleware = require('../middlewares/cookie-middleware');

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --------------------------------- ROUTE TO GET A USER WITH HIS ID ---------------------------------
router.get('/:id', async (req, res) => {
    try {
        // Connect to the database
        await database.connectDatabase();

        // Get the 'users' collection
        const collection = mongoose.connection.collection('users');

        // Read the request parameters
        const { id } = req.params;
        console.log(id, "id");

        // Find the user in the database
        const user = await collection.findOne({
            _id: mongoose.Types.ObjectId(id)
        });
        console.log(user, "user");

        // Validate the user
        if (!user) {
            throw new Error("User not found");
        }

        // Create the response data object
        const responseData = {
            id: user._id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            bio: user.bio
        };

        // Send the result back to the client
        res.status(200).send(responseData);
    } catch (error) {
        console.error(error);
        res.status(400).send("An error occurred whle connecting to the database");
    }
});

// --------------------------------- ROUTE TO DELETE A USER WITH HIS ID ---------------------------------
router.delete('/:id', async (req, res) => {
    try {
        // Connect to the database
        await database.connectDatabase();

        // Get the 'users' collection
        const collection = mongoose.connection.collection('users');

        // Read the request parameters
        const { id } = req.params;
        console.log(req.params, "req.params");
        console.log(id, "id");

        // Delete the user from the database
        await collection.deleteOne({ _id: mongoose.Types.ObjectId(id) });

        // Send a success message to the client
        res.status(200).send({ message: 'User successfully deleted' });
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: 'An error occurred while deleting the user' });
    }
});

// --------------------------------- ROUTE TO GET ALL USERS ---------------------------------
router.get('/', async (req, res) => {
    try {
        // Connect to the database
        await database.connectDatabase();

        // Get the 'users' collection
        const collection = mongoose.connection.collection('users');

        // Find all the users in the database
        const users = await collection.find({}).toArray();

        // Create the response data object
        const responseData = users.map(user => {
            return {
                id: user._id,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                bio: user.bio
            };
        }
        );
        // Send the result back to the client
        res.status(200).send(responseData);
    } catch (error) {
        console.error(error);
        res.status(400).send("An error occurred whle connecting to the database");
    }
});


// --------------------------------- ROUTE TO PUT A USER WITH HIS ID ---------------------------------
router.put('/:id', async (req, res) => {
    try {
        // Connect to the database
        await database.connectDatabase();

        // Get the 'users' collection
        const collection = mongoose.connection.collection('users');

        // Read the request parameters
        const { id } = req.params;

        console.log(req.body);

        // Define the update data 
        let updateData = {};
        if (typeof req.body.user.firstName !== 'undefined' && req.body.user.firstName !== '') {
            updateData.firstName = req.body.user.firstName;
        }

        if (typeof req.body.user.lastName !== 'undefined' && req.body.user.lastName !== '') {
            updateData.lastName = req.body.user.lastName;
        }

        if (typeof req.body.user.email !== 'undefined' && req.body.user.email !== '') {
            updateData.email = req.body.user.email;
        }

        if (typeof req.body.user.phoneNumber !== 'undefined' && req.body.user.phoneNumber !== '') {
            updateData.phoneNumber = req.body.user.phoneNumber;
        }

        if (typeof req.body.user.password !== 'undefined' && req.body.user.password !== '') {
            updateData.password = bcrypt.hashSync(req.body.user.password, 10);
        }

        if (typeof req.body.user.bio !== 'undefined' && req.body.user.bio !== '') {
            updateData.bio = req.body.user.bio;
        }

        console.log(updateData);

        // Update the user in the database
        await collection.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(id)
        }, { $set: updateData });

        // Send the user in the database to the client
        responseData = await collection.findOne({
            _id: mongoose.Types.ObjectId(id)
        });

        // Send the result back to the client
        res.status(200).send(responseData);
    } catch (error) {
        console.error(error);
        if (error.name === 'MongoServerError' && error.code === 11000) {
            res.status(400).send("Email already exists");
        } else {
            console.error(error);
            res.status(400).send("An error occurred whle connecting to the database");
        }
    }
});

// Route pour récupérer un utilisateur en fonction de son identifiant avec tous les détails et les animaux qu'il possède (protégée pour l'administrateur)
router.get('/:id/full', cookieMiddleware, async (req, res) => {
});

module.exports = router;