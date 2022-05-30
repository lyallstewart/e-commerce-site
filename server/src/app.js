// Required imports
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path')
const setupDatabase = require('./database/db');
const crypto = require('crypto');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

// Setup express server
const app = express();
module.exports = app;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Connect to the Mongo DB
const database = setupDatabase();

/**
 * Setup routes (user routes)
 */

// Handle GET requests to /users (will need to be secured)
app.get('/users', async (req, res) => {
    const users = await database.User.find();
    res.json(users);
});

// Handle GET requests to /users/:username
app.get('/users/:username', async (req, res) => {
    const user = await database.User.findOne({ username: req.params.username });
    res.json(user);
});

// Handle DELETE requests to /users/:username (will be secured)
app.delete('/users/:username', async (req, res) => {
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
});

// Handle PATCH requests to /users (will be secured)
app.patch('/users/:username', async (req, res) => {
    const user = await database.User.findOne({username:req.params.username})
    if(!user) {
        res.status(404).json({error: 'User does not exist'});
    } else {
        try {
            const salt = crypto.randomBytes(128).toString('base64');
            const iterations = 10000;
            const hash = crypto.pbkdf2Sync(req.body.password, salt, iterations, 64, 'sha512').toString('base64');
            const user = await database.User.findOneAndUpdate({username: req.params.username}, {
                username: req.body.username,
                password: {
                    hash,
                    salt,
                    iterations
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
});

// Handle POST request to /login
app.post('/login', async (req, res) => {
    const user = await database.User.findOne({username: req.body.username});
    if (!user) {
        res.status(404).json({error: 'User does not exist'});
    } else {
        const hash = crypto.pbkdf2Sync(req.body.password, user.password.salt, user.password.iterations, 64, 'sha512').toString('base64');
        if (hash === user.password.hash) {
            res.status(200);
        } else {
            res.status(401).json({error: 'Incorrect password'});
        }
    }
});

// Handle POST requests to /signup
app.post('/signup', async (req, res) => {
    user = await database.User.findOne({username:req.body.username})
    if (!user) {
        const salt = crypto.randomBytes(128).toString('base64');
        const iterations = 10000;
        const hash = crypto.pbkdf2Sync(req.body.password, salt, iterations, 64, 'sha512').toString('base64');

        const newUser = new database.User({
            username: req.body.username,
            password: {
                hash,
                salt,
                iterations
            },
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            admin: false,
        });
        try {
            await newUser.save();
            res.status(201);
        } catch (err) {
            res.status(500).json(err.message);
        }
    } else {
        res.status(400).json({error: 'User already exists'});
    }
});

// Start express server
app.listen(process.env.port, () => console.log(`App listening on port ${process.env.port}!`))