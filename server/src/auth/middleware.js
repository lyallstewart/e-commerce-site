// Access control middleware for login-required routes
const isAuthorised = (req, res, next) => {
    if (req.session.authenticated) {
        res.next();
    } else {
        res.status(403).send('You are not authorised to access this route');
    }
}

// Access control middleware for admin-only routes
const isAdmin = (req, res, next) => {
    if (req.session.authenticated && req.session.admin) {
        res.next();
    } else {
        res.status(403).send('You are not authorised to access this route');
    }
}

module.exports = { isAuthorised, isAdmin };