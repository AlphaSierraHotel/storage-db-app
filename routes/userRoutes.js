const express = require('express');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const db = require('../db');

const router = express.Router();

// Update password only (PUT)
router.put('/:id/password', [
  check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(
        `UPDATE users SET password = ? WHERE id = ?`,
        [hashedPassword, id],
        function (err) {
            if (err) return res.status(500).send('Failed to update password');
            if (this.changes === 0) return res.status(404).send('User not found');
            res.status(200).send('Password updated successfully');
        }
    );
});

// Create new user (POST) with validation
router.post(
  '/create',
  [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    check('role', 'Role is required').notEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  }
);

// Fetch all users (GET)
router.get('/', (req, res) => {
  db.all(`SELECT id, username, role FROM users`, [], (err, rows) => {
    if (err) return res.status(400).send(err.message);
    res.json(rows);
  });
});

// Update existing user (PUT) with validation
router.put(
  '/:id',
  [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    check('role', 'Role is required').notEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
  }
);

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
