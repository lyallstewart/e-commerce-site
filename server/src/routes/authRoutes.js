const express = require('express');
const authRouter = express.Router();
const database = require('../database/db');
const passport = require('../auth/passport');
const crypto = require('crypto')
const {login, logOut, signUp} = require('../auth/helpers')

// Handle POST requests to auth routes using helper functions
authRouter.post('/signup', signUp)
          .post('/logout', logOut)
          .post('/login', login)

module.exports = authRouter