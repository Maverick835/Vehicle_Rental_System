const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all rentals
router.get('/', (req, res) => {
  db.query(`
    SELECT r.*, v.make, v.model, v.type, u.name as user_name
    FROM rentals r
    JOIN vehicles v ON r.vehicle_id = v.id
    JOIN users u ON r.user_id = u.id
  `, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get rental by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query(`
    SELECT r.*, v.make, v.model, v.type, u.name as user_name
    FROM rentals r
    JOIN vehicles v ON r.vehicle_id = v.id
    JOIN users u ON r.user_id = u.id
    WHERE r.id = ?
  `, [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).json({ message: 'Rental not found' });
    }
    res.json(results[0]);
  });
});

// Create new rental
router.post('/', (req, res) => {
  const { user_id, vehicle_id, start_date, end_date, total_price } = req.body;
  
  // Start transaction
  db.beginTransaction((err) => {
    if (err) throw err;

    // Check if vehicle is available
    db.query('SELECT available FROM vehicles WHERE id = ?', [vehicle_id], (err, results) => {
      if (err) {
        return db.rollback(() => {
          throw err;
        });
      }

      if (results.length === 0 || !results[0].available) {
        return db.rollback(() => {
          res.status(400).json({ message: 'Vehicle is not available' });
        });
      }

      // Create rental
      db.query(
        'INSERT INTO rentals (user_id, vehicle_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)',
        [user_id, vehicle_id, start_date, end_date, total_price],
        (err, results) => {
          if (err) {
            return db.rollback(() => {
              throw err;
            });
          }

          // Update vehicle availability
          db.query(
            'UPDATE vehicles SET available = 0 WHERE id = ?',
            [vehicle_id],
            (err) => {
              if (err) {
                return db.rollback(() => {
                  throw err;
                });
              }

              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    throw err;
                  });
                }
                res.status(201).json({ message: 'Rental created successfully', id: results.insertId });
              });
            }
          );
        }
      );
    });
  });
});

// Update rental status
router.put('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    'UPDATE rentals SET status = ? WHERE id = ?',
    [status, id],
    (err, results) => {
      if (err) throw err;
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Rental not found' });
      }
      res.json({ message: 'Rental status updated successfully' });
    }
  );
});

module.exports = router; 