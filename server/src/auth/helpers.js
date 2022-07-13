const passport = require('passport');
// TODO: Use bcrypt instead
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

const signUp = async (req, res, next) => {
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
}

const login = (req, res, next) => {
    passport.authenticate(
        'local', (err, user, info) => {
                if (err) return res.status(500).send();
                if (!user) {
                    return res.status(401)
                              .json({ error: { status: 401,
                                               data: info.message }
                                        })
                    }
                req.login(user, (err) => {
                    if (err) return next(err);
                    const { id, first_name, last_name, email } = req.user;
                    return res.json({id, first_name, last_name, email});
                })
        }
)(req, res, next);
}

const logOut = (req, res, next) => {
    req.logout();
    res.clearCookie('connect.sid');
    req.session.destroy(function (err) {
        res.status(200).send();
    });
}

const isAuthorised = (req, res, next) => {
    if (req.session.isAuthenticated()) {
        res.next();
    } else {
        res.status(401).send('Unauthenticated users may not access this route');
    }
}

const isAdmin = (req, res, next) => {
    if (req.session.isAuthenticated() && req.user.admin) {
        res.next();
    } else {
        res.status(403).send('Route is restricted to administrators');
    }
}

module.exports = {
    hashPassword,
    signUp,
    login,
    logOut,
    isAuthorised,
    isAdmin
}