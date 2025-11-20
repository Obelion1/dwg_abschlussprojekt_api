// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Parse JSON in request bodies
app.use(express.json());

// Get all users (to test your users table)
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, email, password_hash FROM user');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});