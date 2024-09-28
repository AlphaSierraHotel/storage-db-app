const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');

// Function to authenticate users using JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);  // No token provided

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);  // Invalid token
        }
        req.user = user;  // Attach the user info to request
        next();  // Proceed to the next middleware or route handler
    });
}

// Function to generate JWT
function generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = { authenticateToken, generateAccessToken };
