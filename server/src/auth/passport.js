const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const database = require('../database/db');
const path = require('path');
const crypto = require('crypto');
const { hashPassword } = require('./helpers');

// This gets called whenever passport.authenticate('local') is called.
passport.use(new LocalStrategy((username, password, done) => {
    database.User.findOne({ username }, async function (err, user) {
        if (err) done(err);
        if (!user) done(null, false, { message: 'User does not exist' });
        const userPassword = user.password.hash;
        let hashedPassword = (await hashPassword(password, user.password.salt)).hash;
        if (userPassword != hashedPassword) {
            return done(null, false, { message: 'Incorrect password' });   
        }
        return done(null, user);
    });
}))

passport.serializeUser((user, done) => {
    done(null, user.userId);
});

passport.deserializeUser((id, done) => {
    database.User.findOne({userId: id}, (err, user) => {
        if (err) { return done(err); }
        done(err, user);
    });
});


// The application must use this instance of passport, rather than initializing a new one.
module.exports = passport;