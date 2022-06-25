const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const database = require('../database/db');
const path = require('path');
const crypto = require('crypto');

const hashPassword = async (password, salt) => {
    if(!salt) {
        salt = crypto.randomBytes(128).toString('base64');
    } 
    const iterations = 10000;
    // Using bcrypt to hash the password would be more secure, but this is fine for now and is simpler
    const hash = await crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('base64');
    return { hash, salt};
}

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