const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const keys = require('./config/keys');

const userRoutes = require('./api/routes/users');
const goalRoutes = require('./api/routes/goals');

// Connect to mlabs
mongoose.connect(keys.mongoURI);

// Set up bodyparser and cors as middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// Handles routes that have been defined in our api
app.use('/api/users', userRoutes);
app.use('/api/goals', goalRoutes);

// Routes not in our api that the user enters as a url passes through here
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// Handles errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;