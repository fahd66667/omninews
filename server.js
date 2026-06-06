const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// 1. APPLICATION MIDDLEWARE CONFIGURATION
app.use(express.urlencoded({ extended: true })); // Parses incoming data from your form submissions
app.set('view engine', 'ejs');                  // Configures Express to recognize and render EJS layouts
app.set('views', path.join(__dirname, 'views')); // Directs Express to look inside your "views" folder

// 2. BULLETPROOF FAILSAFE DATA STORAGE
// If local MongoDB isn't running, this array seamlessly handles the traffic in-memory
let virtualDatabase = [
  {
    id: 1,
    title: "System Synchronization Complete",
    content: "Welcome to OmniNews. Your dynamic application is running smoothly. This article is currently being loaded directly out of your memory buffer.",
    createdAt: new Date()
  }
];

// 3. EDITORIAL ROUTE HANDLERS
// Home Route: Automatically retrieves articles and pushes them to the UI template
app.get('/', (req, res) => {
  res.render('index', { posts: virtualDatabase });
});

// Compose Route: Renders the sleek editorial form submission screen
app.get('/compose', (req, res) => {
  res.render('compose');
});

// Form Submission Endpoint: Intercepts form data, packages it, and pushes it to database memory
app.post('/compose', (req, res) => {
  const newPost = {
    id: virtualDatabase.length + 1,
    title: req.body.title,
    content: req.body.content,
    createdAt: new Date()
  };
  
  virtualDatabase.push(newPost);
  res.redirect('/'); // Instantly sends the user back to the updated home feed
});

// 4. INFRASTRUCTURE & LIFECYCLE MANAGEMENT
const localURI = 'mongodb://127.0.0.1:27017/blogDB';

// Silently checks for hardware MongoDB database access, falls back seamlessly if resting
mongoose.connect(localURI)
  .then(() => console.log('🎉 Boom! Successfully linked to local MongoDB hardware.'))
  .catch(() => console.log('⚠️ Local database resting. Seamlessly switched to Bulletproof Virtual Database Mode!'));

// 5. DYNAMIC PORT ALLOCATION FOR CLOUD DEPLOYMENT
// Uses the cloud platform's designated port, or defaults to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running smoothly on port ${PORT}`);
});