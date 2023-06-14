const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        // Connect to the database
        console.log("Connecting to the database");
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'PetAdoption',
        });
        console.log("Connected to the database");
    } catch (error) {
        console.log("Error: ", error.message);
    }
};

const closeDatabase = async () => {
    // Close the database connection for free up resources and avoid memory leaks
    console.log("Closing connection to the database");
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
    }
    console.log("Database connection closed");
};

module.exports = {
    connectDatabase,
    closeDatabase
};
