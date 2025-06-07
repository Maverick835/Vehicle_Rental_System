const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all vehicles
router.get('/', (req, res) => {
  db.query('SELECT * FROM vehicles', (err, results) => {
    if (err) throw err;
    // Ensure image_url is properly formatted
    const vehicles = results.map(vehicle => ({
      ...vehicle,
      image_url: vehicle.image_url || null // Ensure null if no image_url
    }));
    res.json(vehicles);
  });
});

// Get vehicle by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM vehicles WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(results[0]);
  });
});

// Add new vehicle
router.post('/', (req, res) => {
  const { make, model, year, type, price_per_day, available } = req.body;
  db.query(
    'INSERT INTO vehicles (make, model, year, type, price_per_day, available) VALUES (?, ?, ?, ?, ?, ?)',
    [make, model, year, type, price_per_day, available],
    (err, results) => {
      if (err) throw err;
      res.status(201).json({ message: 'Vehicle added successfully', id: results.insertId });
    }
  );
});

// Update vehicle
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { make, model, year, type, price_per_day, available } = req.body;
  db.query(
    'UPDATE vehicles SET make = ?, model = ?, year = ?, type = ?, price_per_day = ?, available = ? WHERE id = ?',
    [make, model, year, type, price_per_day, available, id],
    (err, results) => {
      if (err) throw err;
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      res.json({ message: 'Vehicle updated successfully' });
    }
  );
});

// Delete vehicle
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM vehicles WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  });
});

module.exports = router; 