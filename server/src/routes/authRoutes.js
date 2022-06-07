const express = require('express');
const authRouter = express.Router();
const database = require('../database/db');
const passport = require('../auth/auth');

// Handle POST request to /auth/login
authRouter.post("/login",
//   passport.authenticate("local", { failureRedirect : "/login"}),
  async (req, res) => {
//     res.redirect('/home')
//     res.status(200).json("Login successful");
//     console.log("Login successful");
//   }
    const user = await database.User.findOne({username: req.body.username});
    if (!user) {
        res.status(404).json({error: 'User does not exist'});
        console.log("Invalid user")
    } else {
        const hash = crypto.pbkdf2Sync(req.body.password, user.password.salt, user.password.iterations, 64, 'sha512').toString('base64');
        if (hash === user.password.hash) {
            req.session.authenticated = true;
            req.session.user = user;
            if (user.admin)  {
                req.session.admin = true;
                res.status(200).json({message: 'Admin logged in successfully'});
            } else {
                res.status(200).json({message: 'Login successful'});
            }
            console.log("Login successful");
        } else {
            res.status(401).json({error: 'Incorrect password'});
            console.log("Login failed: incorrect password")
        }
    }
});

// Handle POST requests to /auth/signup
authRouter.post('/signup', async (req, res) => {
    const user1 = await database.User.findOne({username:req.body.username})
    const user2 = await database.User.findOne({email:req.body.email})
    if (!user1 && !user2) {
        const salt = crypto.randomBytes(128).toString('base64');
        const iterations = 10000;
        const hash = crypto.pbkdf2Sync(req.body.password, salt, iterations, 64, 'sha512').toString('base64');

        const newUser = new database.User({
            username: req.body.username,
            password: {
                hash,
                salt,
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
    console.log("User created successfully");
});

module.exports = authRouter