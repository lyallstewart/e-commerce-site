// Package imports
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path')
const crypto = require('crypto');
const fs = require('fs');
const http = require('http');
const https = require('https');
const cors = require('cors');
const passport = require('./auth/auth');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

// Local module imports
const database = require('./database/db');
const orderRouter = require('./routes/orderRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const authRouter = require('./routes/authRoutes');
const cartRouter = require('./routes/cartRoutes');
const {isAdmin, isAuthorised} = require('./auth/middleware');

const privateKey = fs.readFileSync(path.resolve(__dirname, './auth/ssl/key.pem'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, './auth/ssl/cert.pem'), 'utf8');
const sslCredentials = {key: privateKey, cert: certificate};

// Setup express server with middleware
app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup session storage in database
const store = new MongoDBStore(
    {
      uri: process.env.MONGODB_URI,
      databaseName: 'ecommerce',
      collection: 'sessions'
    }
);

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      cookie: { maxAge: 1000 * 60 * 60 * 24, secure: true, httpOnly: true },
      resave: false,
      saveUninitialized: false,
      store
    })
  );

app.use(passport.initialize());
app.use(passport.session());

// Logging middleware (runs on all requests, even invalid ones)
app.use('/', (req, res, next) => {
  console.log(`LOGGING: ${req.method} request to ${req.originalUrl}`);
  next();
});

// Testing route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Init routers from ./routers
app.use('/orders', orderRouter);
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/auth', authRouter);

// Runs if all other handling fails
app.use((req, res, next) => {
    res.status(404).send("Oh no, that URL does not exist!")
})

// Start HTTPS server running express app
const httpsServer = https.createServer(sslCredentials, app);
try {
    httpsServer.listen(8443);
    console.log("Server started on port 8443");
} catch (err) {
    console.log(`An error occurred, could not start the server:\n${err.message}`);
}

module.exports = app;