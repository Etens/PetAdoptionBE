const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const database = require('../database');
const Pet = require('../models/Pet');
const checkRoleAdminMiddleware = require('../middlewares/checkRoleAdminMiddleware');

router.get('/', async (req, res) => {
    console.log("Received a request to the /pets route");
    try {
        // Connect to the database
        await database.connectDatabase();

        // Get the 'pets' collection
        console.log("Connecting to the 'pets' collection");
        const collection = mongoose.connection.collection('pets');
        console.log("Connected to the 'pets' collection");

        // Get all pets from the database
        console.log("Getting all pets");
        const pets = await collection.find({}).toArray();
        console.log("Successfully got all pets");

        // Create the response data object
        const responseData = {
            pets: pets
        };

        // Send the result back to the client
        console.log("Sending response");
        res.status(200).json(responseData);
        console.log("Response sent");
    } catch (error) {
        console.log("Response sent");
        res.status(500).json({
            message: error.message
        });
        console.log("Response sent");
    } 
});

router.post('/', checkRoleAdminMiddleware, async (req, res) => {
    const role = req.get('User-Role');
    console.log("Received a request to the /pet route");
    try {
        // Connect to the database
        await database.connectDatabase();

        // Get the 'pets' collection
        console.log("Connecting to the 'pets' collection");
        const collection = mongoose.connection.collection('pets');
        console.log("Connected to the 'pets' collection");

        // Read the request body
        console.log("Reading request body");
        const { id, type, name, adoptionStatus, picture, height, weight, color, bio, hypoallergenic, dietaryRestrictions, breed } = req.body;

        // Create a new Pet object
        console.log("Creating pet object");
        const pet = new Pet({
            id,
            type,
            name,
            adoptionStatus,
            picture,
            height,
            weight,
            color,
            bio,
            hypoallergenic,
            dietaryRestrictions,
            breed
        });

        // Validate the Pet object
        console.log("Validating pet object");
        await pet.validate();

        // Insert the pet into the database
        console.log("Inserting pet into the database");
        const result = await collection.insertOne(pet);
        console.log("Pet successfully inserted into the database");

        // Create the response data object
        const responseData = {
            result: result
        };

        // Send the result back to the client
        console.log("Sending response");
        res.status(200).json(responseData);
        console.log("Response sent");
    } catch (error) {
        console.log("Error: ", error.message);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;

