const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const User = require('./models/User');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Shared Navigation Bar Component for layout consistency (Updated to OmniBlog)
const renderNavbar = (username) => `
  <header style="background: rgba(20, 22, 33, 0.85); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 20px 40px; display: flex; justify-content: space-between; align-items: center;">
    <div style="font-size: 1.5rem; font-weight: 800; letter-spacing: 2px; color: #f0f2f5;">OMNIBLOG</div>
    <nav>
      <a href="/" style="color: #f0f2f5; text-decoration: none; margin-left: 20px; font-weight: 500;">Feed</a>
      ${username ? `
        <a href="/compose" style="color: #f0f2f5; text-decoration: none; margin-left: 20px; font-weight: 500;">Compose</a>
        <a href="/dashboard" style="color: #e2ba43; text-decoration: none; margin-left: 20px; font-weight: 600;">Dashboard</a>
        <a href="/logout" style="color: #ff6b6b; text-decoration: none; margin-left: 20px; font-weight: 500;">Logout</a>
      ` : `
        <a href="/login" style="color: #e2ba43; text-decoration: none; margin-left: 20px; font-weight: 600; border: 1px solid #e2ba43; padding: 6px 16px; border-radius: 6px;">Sign In</a>
        <a href="/signup" style="color: #000; background: #e2ba43; text-decoration: none; margin-left: 15px; font-weight: 600; padding: 7px 16px; border-radius: 6px;">Join</a>
      `}
    </nav>
  </header>
`;

// Dynamic database storage simulation (Updated Default Post)
let platformPosts = [
  { 
    id: 1, 
    title: "Welcome to your new OmniBlog!", 
    content: "This is your very first platform post. Log in, open up your personal dashboard, and start customizing your writing workspace!", 
    author: "System Core" 
  }
];

// Routes
app.get('/', (req, res) => {
  const user = req.cookies.username || null;
  res.render('index', { posts: platformPosts, user, navbar: renderNavbar(user) });
});

app.get('/dashboard', (req, res) => {
  const user = req.cookies.username;
  if (!user) return res.redirect('/login');
  const myPosts = platformPosts.filter(p => p.author === user);
  res.render('dashboard', { username: user, posts: myPosts, navbar: renderNavbar(user) });
});

app.get('/compose', (req, res) => {
  const user = req.cookies.username;
  if (!user) return res.redirect('/login');
  res.render('compose', { user, navbar: renderNavbar(user) });
});

app.post('/compose', (req, res) => {
  const user = req.cookies.username;
  if (!user) return res.redirect('/login');
  platformPosts.push({ id: platformPosts.length + 1, title: req.body.title, content: req.body.content, author: user });
  res.redirect('/dashboard');
});

app.get('/login', (req, res) => res.render('login', { navbar: renderNavbar(null) }));
app.get('/signup', (req, res) => res.render('signup', { navbar: renderNavbar(null) }));

app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.redirect('/login');
  } catch (err) { res.status(500).send("Error compiling writer profile."); }
});

app.post('/api/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.status(400).send("Invalid credentials.");
    res.cookie('username', user.username, { httpOnly: true, maxAge: 86400000 });
    res.redirect('/dashboard');
  } catch (err) { res.status(500).send("Login platform interface failed."); }
});

app.get('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/');
});

mongoose.connect('mongodb://127.0.0.1:27017/blogDB')
  .then(() => console.log("Connected to local database hardware."))
  .catch(() => console.log("Virtual standalone database mode active."));

module.exports = app;
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Blogging Server executing on port ${PORT}`));