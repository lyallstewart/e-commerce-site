// Required imports
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path')
const setupDatabase = require('./database/db');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

// Setup express server
const app = express();
module.exports = app;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Connect to the Mongo DB
const databaseConfigs = setupDatabase();

// Start express server
app.listen(process.env.port, () => console.log(`App listening on port ${process.env.port}!`))