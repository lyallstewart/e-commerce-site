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
const helmet = require('helmet');
const passport = require('passport');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

// Local module imports
const database = require('./database/db');
const orderRouter = require('./routes/orderRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const authRouter = require('./routes/authRoutes');
const cartRouter = require('./routes/cartRoutes');
const {isAdmin, isAuthorised} = require('./auth/helpers');

// Setup express server with middleware
app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());

// Initialize sessions and session storage
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.SSL
      },
      resave: false,
      saveUninitialized: false,
      store: new MongoDBStore(
        {
          uri: process.env.MONGODB_URI,
          databaseName: 'ecommerce',
          collection: 'sessions'
        })
    })
  );

app.use(passport.initialize());
app.use(passport.session());

// Logging middleware (runs on all requests, even invalid ones)
app.use('/', (req, res, next) => {
  console.log(`LOGGING: ${req.method} request to ${req.originalUrl}`);
  next();
});


// Init routers from ./routers
app.use('/orders', orderRouter);
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/auth', authRouter);

// Error handlers
app.use((req, res, next) => {
    res.status(404).send("Oh no, that URL does not exist!")
})

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).send({
    error: {
        status: error.status || 500,
        data: error.message || 'Internal Server Error',
    },
})
})

// Start HTTPS or HTTP server running express app
try {
  if(process.env.SSL == true) {
    const certificate = fs.readFileSync(path.resolve(__dirname, './auth/ssl/cert.pem'), 'utf8');
    const sslCredentials = {
      key: fs.readFileSync(path.resolve(__dirname, './auth/ssl/key.pem'), 'utf8'),
      cert: fs.readFileSync(path.resolve(__dirname, './auth/ssl/cert.pem'), 'utf8')
    };
    const httpsServer = https.createServer(sslCredentials, app);
    httpsServer.listen(process.env.PORT || 3001);
    console.log(`Server started on ${process.env.PORT || 3001}`);
  } else {
    // If on an online IDE, start the server without HTTPS
    app.listen(process.env.PORT || 3001, () => {
      console.log(`Server started on ${process.env.PORT || 3001}`);
    })
  }
} catch (e) {
  console.log(`Error encountered while trying to start the server:\n${e.message}`);
}

module.exports = app;