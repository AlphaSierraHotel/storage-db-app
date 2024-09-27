const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { generateAccessToken } = require('../auth');

const router = express.Router();

// Admin user can create new users
router.post('/create', (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).send('All fields (username, password, role) are required');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    
    db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, 
           [username, hashedPassword, role], (err) => {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).send('Username already exists');
            }
            return res.status(500).send(`User creation failed: ${err.message}`);
        }
        res.status(201).send('User created successfully');
    });
});


// Admin user login to get JWT token
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).send('Invalid credentials');
        }
        const token = generateAccessToken({ username: user.username, role: user.role });
        res.json({ token });
    });
});

// List all users
router.get('/', (req, res) => {
    db.all(`SELECT id, username, role FROM users`, [], (err, rows) => {
        if (err) return res.status(400).send(err.message);
        res.json(rows);
    });
});

// Update or delete user routes could be added similarly


// router.post('/init-admin', (req, res) => {
//     const { username, password, role } = req.body;

//     if (role !== 'admin') {
//         return res.status(400).send('Role must be admin for this route');
//     }

//     const hashedPassword = bcrypt.hashSync(password, 10);
//     db.run(`INSERT INTO users (username, password, role) VALUES (?, ?, ?)`, 
//            [username, hashedPassword, role], (err) => {
//         if (err) return res.status(400).send('Admin user initialization failed');
//         res.status(201).send('Admin user created successfully');
//     });
// });


module.exports = router;
