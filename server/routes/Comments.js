const express = require('express'); // Import the express module
const router = express.Router(); // Create a new router
const { Comments } = require('../models'); // Import the Comments model
const { validateToken } = require('../middlewares/AuthMiddleware'); // Import the validateToken middleware

router.get('/:postId', async (req, res) => {
    const postId = req.params.postId; // Get the postId from the request
    const comments = await Comments.findAll({ where: { PostId: postId } }); // Find comments by postId
    res.json(comments); // Send the comments as a response
});

router.post('/', validateToken, async (req, res) => {
    const comment = req.body; // Get the comment from the request
    const username = req.user.username; // Get the username from the request
    comment.username = username; // Set the username
    await Comments.create(comment); // Create a new comment
    res.json(comment); // Send the comment as a response
});

module.exports = router; // Export the router