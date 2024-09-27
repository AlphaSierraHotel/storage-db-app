const express = require('express');
const db = require('../db');

const router = express.Router();

// Create HDD data entry
router.post('/', (req, res) => {
    const { date, time, disk_model, serial_number, capacity, smart_health, smart_details } = req.body;
    db.run(`INSERT INTO hdd_entries (date, time, disk_model, serial_number, capacity, smart_health, smart_details) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`, 
            [date, time, disk_model, serial_number, capacity, smart_health, smart_details], 
            (err) => {
                if (err) return res.status(400).send('Failed to add HDD entry');
                res.status(201).send('HDD entry added');
            });
});

// Get all HDD entries
router.get('/', (req, res) => {
    db.all(`SELECT * FROM hdd_entries`, [], (err, rows) => {
        if (err) return res.status(400).send(err.message);
        res.json(rows);
    });
});

// Delete HDD entry (admin only)
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM hdd_entries WHERE id = ?`, [id], (err) => {
        if (err) return res.status(400).send('Failed to delete HDD entry');
        res.status(200).send('HDD entry deleted');
    });
});

module.exports = router;
