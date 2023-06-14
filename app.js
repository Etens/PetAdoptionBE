const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

require('dotenv').config();

// --- Requiring MongoDB and MongoClient
const { MongoClient } = require('mongodb');

// --- Setting up a new MongoClient with the connection URL stored in the MONGO_URL environment variable
const client = new MongoClient(process.env.MONGO_URL);

// --- Requiring the signup router
const signupRouter = require('./routes/signup');

// --- Requiring the login router
const loginRouter = require('./routes/login');

// --- Requiring the pets router
const petsRouter = require('./routes/pets');

// --- Requiring the users router
const usersRouter = require('./routes/users');

// --- Adding cookie parser middleware
app.use(cookieParser());

// --- Configuring CORS to only allow requests from the specified origin
app.use(cors({
origin: 'http://localhost:3000',
methods: ['POST'],
methods: ['GET'],
methods: ['PUT'],
methods: ['DELETE']
}));


// --- Adding body parser middleware 
app.use(bodyParser.json());

// --- Mounting the signup router on the '/signup' path
app.use('/signup', signupRouter);

// --- Mounting the login router on the '/login' path
app.use('/login', loginRouter);

// --- Mounting the pet router on the '/pet' path
app.use('/pet', petsRouter);

// --- Mounting the pets router on the '/pets' path
app.use('/pets', petsRouter);

// --- Mounting the users router on the '/users' path
app.use('/users', usersRouter);

// --- Async function to connect to the database
async function main() {
await client.connect();
return 'Connected to the database';
}

// --- Connecting to the database, logging any potential errors, and closing the connection when the function finishes executing
main()
.then(console.log)
.catch(console.error)
.finally(() => client.close());

// --- Setting the port to 3002 for the server
const port = 3002;

// --- Starting the server on the specified port
app.listen(port, () => {
console.log(`Server started on port ${port}`);
});