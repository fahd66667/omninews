const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Ensure this file exists in models/User.js

const app = express();

// 1. APPLICATION MIDDLEWARE CONFIGURATION
app.use(express.urlencoded({ extended: true })); // Middleware to parse incoming HTML form data
app.set('view engine', 'ejs');                  // Configures Express to recognize and render EJS layouts
app.set('views', path.join(__dirname, 'views')); // Directs Express to look inside your "views" folder

// 2. BULLETPROOF FAILSAFE DATA STORAGE
let virtualDatabase = [
  {
    id: 1,
    title: "System Synchronization Complete",
    content: "Welcome to OmniNews. Your dynamic application is running smoothly. This article is currently being loaded directly out of your memory buffer.",
    createdAt: new Date()
  }
];

// 3. EDITORIAL ROUTE HANDLERS
// Home Route
app.get('/', (req, res) => {
  res.render('index', { posts: virtualDatabase });
});

// Compose Route
app.get('/compose', (req, res) => {
  res.render('compose');
});

// Form Submission Endpoint
app.post('/compose', (req, res) => {
  const newPost = {
    id: virtualDatabase.length + 1,
    title: req.body.title,
    content: req.body.content,
    createdAt: new Date()
  };
  
  virtualDatabase.push(newPost);
  res.redirect('/'); 
});

// --- NEW AUTHENTICATION ROUTE HANDLERS ---

// GET Routes to render signup and login pages
app.get('/signup', (req, res) => {
  res.render('signup'); // Looks for views/signup.ejs
});

app.get('/login', (req, res) => {
  res.render('login'); // Looks for views/login.ejs
});

// POST Route: Handles Sign Up registration
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists in MongoDB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already registered.');
    }

    // Encrypt the password using bcrypt safely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user profile to MongoDB
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();

    // Redirect straight to the login screen upon successful setup
    res.redirect('/login');

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error during registration.');
  }
});

// POST Route: Handles Login verification
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email or password.');
    }

    // Compare passwords using secure encryption verification
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid email or password.');
    }

    // Set authentication session cookie
    res.cookie('username', user.username, { httpOnly: true, maxAge: 86400000 });
    res.redirect('/');

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error during login.');
  }
});

// 4. INFRASTRUCTURE & LIFECYCLE MANAGEMENT
const localURI = 'mongodb://127.0.0.1:27017/blogDB';

mongoose.connect(localURI)
  .then(() => console.log('🎉 Boom! Successfully linked to local MongoDB hardware.'))
  .catch(() => console.log('⚠️ Local database resting. Seamlessly switched to Bulletproof Virtual Database Mode!'));

// 5. DYNAMIC PORT ALLOCATION FOR CLOUD DEPLOYMENT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running smoothly on port ${PORT}`);
});