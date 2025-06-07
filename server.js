const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static file serving - more explicit configuration
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public')));

// Add this route to debug image serving
app.get('/test-image', (req, res) => {
  res.send(`
    <h1>Image Test</h1>
    <img src="/images/vehicles/TVS_Apache_RTR200.webp" alt="Test Image" />
    <p>If you see the image above, static file serving is working.</p>
  `);
});

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Error registering user' });
    }
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Vehicle routes
app.get('/api/vehicles', async (req, res) => {
  try {
    const { type, category, minPrice, maxPrice } = req.query;
    let query = 'SELECT * FROM vehicles';  // Remove the WHERE available = true
    const params = [];

    if (type) {
      query += query.includes('WHERE') ? ' AND' : ' WHERE';
      query += ' type = ?';
      params.push(type);
    }
    if (category) {
      query += query.includes('WHERE') ? ' AND' : ' WHERE';
      query += ' category = ?';
      params.push(category);
    }
    if (minPrice) {
      query += query.includes('WHERE') ? ' AND' : ' WHERE';
      query += ' price_per_day >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      query += query.includes('WHERE') ? ' AND' : ' WHERE';
      query += ' price_per_day <= ?';
      params.push(maxPrice);
    }

    console.log('Executing query:', query, 'with params:', params);
    const [vehicles] = await pool.execute(query, params);
    console.log('Found vehicles:', vehicles.length);
    
    res.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ 
      message: 'Error fetching vehicles',
      error: error.message 
    });
  }
});

app.get('/api/vehicles/:id', async (req, res) => {
  try {
    const [vehicles] = await pool.execute(
      'SELECT * FROM vehicles WHERE id = ?',
      [req.params.id]
    );
    
    if (vehicles.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.json(vehicles[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle' });
  }
});

// Rental routes
app.post('/api/rentals', authenticateToken, async (req, res) => {
  try {
    const { vehicle_id, start_date, end_date } = req.body;
    const user_id = req.user.id;

    // Check vehicle availability
    const [vehicles] = await pool.execute(
      'SELECT * FROM vehicles WHERE id = ? AND available = true',
      [vehicle_id]
    );

    if (vehicles.length === 0) {
      return res.status(400).json({ message: 'Vehicle is not available' });
    }

    const vehicle = vehicles[0];
    const days = Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24));
    const total_price = vehicle.price_per_day * days;

    // Create rental
    const [result] = await pool.execute(
      'INSERT INTO rentals (user_id, vehicle_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)',
      [user_id, vehicle_id, start_date, end_date, total_price]
    );

    // Update vehicle availability
    await pool.execute(
      'UPDATE vehicles SET available = false WHERE id = ?',
      [vehicle_id]
    );

    res.status(201).json({
      message: 'Rental created successfully',
      rental_id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating rental' });
  }
});

app.get('/api/rentals', authenticateToken, async (req, res) => {
  try {
    const [rentals] = await pool.execute(
      `SELECT r.*, v.make, v.model, v.type, v.category 
       FROM rentals r 
       JOIN vehicles v ON r.vehicle_id = v.id 
       WHERE r.user_id = ?`,
      [req.user.id]
    );
    
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rentals' });
  }
});

app.put('/api/rentals/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const [rentals] = await pool.execute(
      'SELECT * FROM rentals WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (rentals.length === 0) {
      return res.status(404).json({ message: 'Rental not found' });
    }

    const rental = rentals[0];
    if (rental.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending rentals can be cancelled' });
    }

    await pool.execute(
      'UPDATE rentals SET status = "cancelled" WHERE id = ?',
      [req.params.id]
    );

    await pool.execute(
      'UPDATE vehicles SET available = true WHERE id = ?',
      [rental.vehicle_id]
    );

    res.json({ message: 'Rental cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling rental' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 