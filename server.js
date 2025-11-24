// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const cors = require('cors');
app.use(cors());

// Parse JSON in request bodies
app.use(express.json());

//use express-session
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET,  // Add to your .env
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000  // 24 hours
  }
}));


//get all products
app.get('/api/products', async (req, res) =>{
  try {
    const rows = await db.query('SELECT * FROM product');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get all users (db test)
app.get('/api/users', async (req, res) => {
  try {
    const rows = await db.query('SELECT user_id, email, password_hash FROM user');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//insert a new user (unhashed for now)
app.post('/api/register', async (req, res) => {
  try {
    const{ email, password} = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO user (email, password_hash) VALUES (?, ?)',
      [email, password_hash]
    );
    res.status(201).json({ message: 'User created successfully' });
  }catch (error){
  res.status(500).json ({error: error.message})
}
});

//login function

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    //Find user by email
    const users = await db.query(
      'SELECT * FROM user WHERE email = ?',
      [email]
    );

   //Check if user exists
   if (users.length === 0) {
    //keep error vague or not? subject to change
    return res.status(401).json({ error: 'Invalid email' });
  }
  const user = users[0];

  //check  for valid password hash
  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    return res.status(401).json({ error: 'password' });
  }
  // Create token
  req.session.userId = user.user_id;
  req.session.userEmail = user.email;
  req.session.cart = [];
  
  res.json({ message: 'Login successful', user: { id: user.user_id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});