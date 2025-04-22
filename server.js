
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'sensitivv-secure-jwt-secret-key';

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  dbName: "sensitivv", // Make sure this matches your database name
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define your User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  createdAt: { type: Date, default: Date.now },
  language: { type: String, default: 'en' }
});

// Define any other schemas you need for your app
const FoodItemSchema = new mongoose.Schema({
  name: String,
  category: String,
  reactionType: String, // e.g., 'critic', 'sensitiv'
  emoji: String
});

// Create models
const User = mongoose.model('User', UserSchema);
const FoodItem = mongoose.model('FoodItem', FoodItemSchema);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ROUTES

// Test route
app.get("/", (req, res) => {
  res.send("Sensitivv API Server is running 🚀");
});

// Registration route
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      createdAt: new Date(),
      language: 'en',
    });
    
    const savedUser = await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: savedUser._id.toString(), email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      userId: savedUser._id.toString(),
      name: savedUser.name,
      token,
      language: savedUser.language,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(200).json({
      userId: user._id.toString(),
      name: user.name,
      token,
      language: user.language || 'en',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get user profile route
app.get('/api/user-profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Validate session route
app.post('/api/validate-session', authenticateToken, (req, res) => {
  // If middleware passes, the token is valid
  res.status(200).json({ valid: true, userId: req.user.userId });
});

// Get food items route
app.get('/api/food-items', async (req, res) => {
  try {
    const { category, reactionType } = req.query;
    
    let query = {};
    if (category) query.category = category;
    if (reactionType) query.reactionType = reactionType;
    
    const foodItems = await FoodItem.find(query);
    res.json(foodItems);
  } catch (err) {
    console.error("Error fetching food items:", err);
    res.status(500).json({ error: "Error fetching food items" });
  }
});

// Export app for Vercel
module.exports = app;

// Start server if not running on Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5008;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}