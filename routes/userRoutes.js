const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

// Create new user (POST)
router.post('/create', (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
    [username, hashedPassword, role],
    (err) => {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).send('Username already exists');
        }
        return res.status(500).send('Failed to create user');
      }
      res.status(201).send('User created successfully');
    }
  );
});

// Fetch all users (GET)
router.get('/', (req, res) => {
  db.all(`SELECT id, username, role FROM users`, [], (err, rows) => {
    if (err) return res.status(400).send(err.message);
    res.json(rows);
  });
});

// Update existing user (PUT)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?`,
    [username, hashedPassword, role, id],
    function (err) {
      if (err) return res.status(500).send('Failed to update user');
      if (this.changes === 0) return res.status(404).send('User not found');
      res.status(200).send('User updated successfully');
    }
  );
});

// Delete a user (DELETE)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).send('Failed to delete user');
    if (this.changes === 0) return res.status(404).send('User not found');
    res.status(200).send('User deleted successfully');
  });
});

module.exports = router;
