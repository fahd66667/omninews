const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser'); // Run 'npm install cookie-parser'
const User = require('./models/User');

const app = express();

// 1. APPLICATION MIDDLEWARE CONFIGURATION
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Enables reading secure cookie data for user profiles
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. IN-MEMORY CENTRAL DATABASE BUFFER (Fallback)
let virtualDatabase = [
  {
    id: 1,
    title: "Platform Synchronization Online",
    content: "Welcome to the OmniNews Global Network. This network node functions as an open publishing layout for independent terminal logs.",
    author: "System Core",
    createdAt: new Date()
  }
];

// 3. SECURITY GATEWAY MIDDLEWARE (Protects private screens)
function checkAuthentication(req, res, next) {
  const username = req.cookies.username;
  if (!username) {
    // If no credentials found, intercept access and route them back to the gateway
    return res.redirect('/login');
  }
  req.username = username; // Pass user profile information down the line
  next();
}

// 4. PLATFORM ROUTE HANDLERS

// Public Global Feed (Like Blogger's homepage directory)
app.get('/', (req, res) => {
  const loggedInUser = req.cookies.username || null;
  res.render('index', { posts: virtualDatabase, user: loggedInUser });
});

// Private User Terminal Workspace (Blogger Dashboard Layout)
app.get('/dashboard', checkAuthentication, (req, res) => {
  // Filter the system database to display logs belonging exclusively to this account profile
  const myPosts = virtualDatabase.filter(post => post.author === req.username);
  res.render('dashboard', { username: req.username, posts: myPosts });
});

// Secure Compose Screen Access
app.get('/compose', checkAuthentication, (req, res) => {
  res.render('compose', { username: req.username });
});

// Secure Article Publisher Endpoint
app.post('/compose', checkAuthentication, (req, res) => {
  const newPost = {
    id: virtualDatabase.length + 1,
    title: req.body.title,
    content: req.body.content,
    author: req.username, // Automatically maps the author without asking them to type it
    createdAt: new Date()
  };
  
  virtualDatabase.push(newPost);
  res.redirect('/dashboard'); // Take them back to their dashboard to see their updated posts
});

// Account Setup and Gateways
app.get('/signup', (req, res) => res.render('signup'));
app.get('/login', (req, res) => res.render('login'));

app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('Email already registered.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Registration failed.');
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid credentials.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials.');

    // Save session parameter inside client browser cookies safely
    res.cookie('username', user.username, { httpOnly: true, maxAge: 86400000 });
    res.redirect('/dashboard'); // Send them straight to their publishing center
  } catch (err) {
    res.status(500).send('Authentication processing failure.');
  }
});

// Sign Out Termination Link
app.get('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/');
});

// 5. LIFECYCLE MANAGEMENT
const localURI = 'mongodb://127.0.0.1:27017/blogDB';
mongoose.connect(localURI)
  .then(() => console.log('🎉 Linked to local MongoDB hardware.'))
  .catch(() => console.log('⚠️ Running in Virtual Database Mode.'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Network online at port ${PORT}`));