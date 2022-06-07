const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const database = require('../index');

// This gets called whenever passport.authenticate('local') is called.
passport.use(new LocalStrategy((username, password, done) => {
    database.User.findOne({ username }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (!hashPassword(password, user.password.salt).hash === user.password.hash) {
            return done(null, false, { message: 'Incorrect password.' });   
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

const hashPassword = (password, salt) => {
    if(!salt) {
        salt = crypto.randomBytes(128).toString('base64');
    } 
    const iterations = 10000;
    const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('base64');
    return {
        hash,
        salt,
    };
}

// Index.js must use this instance of passport, rather than initializing a new one.
module.exports = passport;