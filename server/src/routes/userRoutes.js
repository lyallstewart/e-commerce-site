const express = require('express');
const userRouter = express.Router();
const database = require('../database/db');

// Handle GET requests to /users (will need to be secured)
userRouter.get('/all', async (req, res) => {
    try {
        const users = await database.User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Handle GET requests to /users/:username
userRouter.get('/:username', async (req, res) => {
    try {
        const user = await database.User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        } else {
        res.json(user);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Handle DELETE requests to /users/:username (will be secured)
userRouter.delete('/:username', async (req, res) => {
    const user = await database.User.findOne({username:req.params.username})
    if(!user) {
        res.status(404).json({error: 'User does not exist'});
    } else {
        try {
            const user = await database.User.findOneAndDelete({username: req.params.username});
            res.status(200);
        } catch (err) {
            res.status(500).json(err.message);
        }
    }
    console.log("User deleted successfully");
});

// Handle PUT requests to /users (will be secured)
userRouter.put('/:username', async (req, res) => {
    const user = await database.User.findOne({username:req.params.username})
    if(!user) {
        res.status(404).json({error: 'User does not exist'});
    } else {
        try {
            const salt = crypto.randomBytes(128).toString('base64');
            const iterations = 10000;
            const hash = crypto.pbkdf2Sync(req.body.password, salt, iterations, 64, 'sha512').toString('base64');
            await database.User.findOneAndUpdate({username: req.params.username}, {
                username: req.body.username,
                password: {
                    hash,
                    salt,
                },
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            });
            res.status(200);
        } catch (err) {
            res.status(500).json(err.message);
        }
    }
    console.log("User updated successfully");
});

module.exports = userRouter