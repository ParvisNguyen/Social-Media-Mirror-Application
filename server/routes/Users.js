const express = require('express'); // Import the express module
const router = express.Router(); // Create a new router
const { Users } = require('../models'); // Import the Users model 
const bcrypt = require('bcrypt'); // Import the bcrypt module

const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/AuthMiddleware');

router.post("/", async (req, res) => {
    const { username, password } = req.body; // Destructure the username and password from the request body
    bcrypt.hash(password, 10).then((hash) => { // Hash the password
        Users.create({ // Create a new user
            username: username, // Set the username
            password: hash // Set the password
        });
        res.json("SUCCESS"); // Respond with success
    });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body; // Destructure the username and password from the request body

    const user = await Users.findOne({ where: { username: username } }); // Find a user with the username

    if (!user) {
        res.json({ error: "User Doesn't Exist" }); // Respond with an error if user does not exist
    }
    // else {
    bcrypt.compare(password, user.password).then((match) => {
        if (!match) {
            res.json({ error: "Wrong Username or Password" }); // Respond with an error if the password does not match
        }// else {

        const accessToken = sign(
            { username: user.username, id: user.id },
            "importantsecret"
        );
        res.json(accessToken); // Respond with the accessToken
        // }
    });
    // }
});

router.get('/auth', validateToken, (req, res) => {
    res.json(req.user);
});
module.exports = router; // Export the router