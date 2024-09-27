const express = require('express');
const crypto = require('crypto');
const db = require('../db');

const router = express.Router();

// Generate a new API key for a user
router.post('/generate', (req, res) => {
    const { user_id } = req.body;
    const apiKey = crypto.randomBytes(20).toString('hex');
    db.run(`INSERT INTO api_keys (key, user_id) VALUES (?, ?)`, [apiKey, user_id], (err) => {
        if (err) return res.status(400).send('Failed to generate API key');
        res.status(201).json({ apiKey });
    });
});

// List all API keys
router.get('/', (req, res) => {
    db.all(`SELECT * FROM api_keys`, [], (err, rows) => {
        if (err) return res.status(400).send(err.message);
        res.json(rows);
    });
});

// Revoke an API key
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM api_keys WHERE id = ?`, [id], (err) => {
        if (err) return res.status(400).send('Failed to revoke API key');
        res.status(200).send('API key revoked');
    });
});

module.exports = router;
