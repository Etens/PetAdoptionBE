const User = require("../models/User");
const mongoose = require('mongoose');

const checkRoleAdminMiddleware = async (req, res, next) => {
    // Get the user's role from the request body
    const role = req.body.role;
    console.log("Received a request to the /pet route");
    // Check if the user's role is 'admin'
    if (role === 'admin') {
        next();
    }
    // If the user's role is not 'admin', send a 401 response to the client
    else {
        res.status(401).send("Unauthorized");
    }
}
module.exports = checkRoleAdminMiddleware;
