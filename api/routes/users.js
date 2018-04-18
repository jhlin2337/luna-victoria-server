const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const checkAuth = require('../middleware/check-auth');
const keys = require('../../config/keys');
const User = require('../models/user');
const Goal = require('../models/goal');

// Create new user
router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            // Check if email already exists in our database
            if (user.length >= 1) {
                return res.status(409).json({ message: "There's already an existing user with this email address" });
            } 
            
            // Create new user if email address doesn't already exist
            else {
                // Encrypt password and save user to database
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    // Check for errors
                    if (err) { 
                        return res.status(500).json({ error: err });
                    } 
                    
                    // Save user to database if encryption was successful
                    else {
                        // Create user using encrypted password
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });

                        // Save user to database
                        user.save()
                            .then(result => {
                                res.status(201).json({ message: "User created" });
                            })
                            .catch(err => {
                                res.status(500).json({ error: err });
                            });
                    }
                });
            }
        });
});

// Login existing user
router.post("/login", (req, res, next) => {
    // Find user in database
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            // Handles case where user does not exist
            if (user.length < 1) {
                return res.status(401).json({ message: "Auth failed" });
            }

            // Check if password entered by user is valid
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                // Handles errors
                if (err) {
                    return res.status(401).json({ message: "Auth failed" });
                }
                
                // Handles successful validation
                if (result) {
                    // Create jwt token
                    const token = jwt.sign(
                        { email: user[0].email, userId: user[0]._id },
                        keys.jwtKey,
                        { expiresIn: "7d" }
                    );

                    // Send jwt token to client
                    return res.status(200).json({ message: "Auth successful", token: token });
                }

                // Handles failed validation
                res.status(401).json({ message: "Auth failed" });
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

// Delete user
router.delete("/", checkAuth, (req, res, next) => {
    // Remove goals made by the user from database
    Goal.remove({ userId: req.userData.userId })
        .exec()
        .then()
        .catch(err => {
            res.status(500).json({ error: err });
        })

    // Remove user from database
    User.remove({ _id: req.userData.userId })
        .exec()
        .then(result => {            
            res.status(200).json({ message: "User deleted" });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

module.exports = router;