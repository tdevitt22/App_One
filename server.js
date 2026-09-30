const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'vibecheck-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 12,
    },
  })
);

app.use(express.static(path.join(__dirname, 'public')));

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Please log in to continue.' });
  }
  next();
}

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

app.get('/api/session', (req, res) => {
  if (!req.session.userId) {
    return res.json({ authenticated: false });
  }

  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(req.session.userId);
  if (!user) {
    req.session.destroy(() => {});
    return res.json({ authenticated: false });
  }

  return res.json({ authenticated: true, user: formatUser(user) });
});

app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const emailTrim = String(email).trim();
  const nameTrim = String(name).trim();

  if (!emailTrim || !nameTrim) {
    return res.status(400).json({ message: 'Name and email cannot be empty.' });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(emailTrim.toLowerCase());
  if (existing) {
    return res.status(409).json({ message: 'An account with that email already exists.' });
  }

  const passwordHash = bcrypt.hashSync(String(password), 10);
  const result = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(
    nameTrim,
    emailTrim.toLowerCase(),
    passwordHash
  );

  req.session.userId = result.lastInsertRowid;
  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(result.lastInsertRowid);

  return res.status(201).json({ message: 'Account created successfully.', user: formatUser(user) });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(String(email).trim().toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const valid = bcrypt.compareSync(String(password), user.password_hash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  req.session.userId = user.id;
  res.json({ message: 'Logged in successfully.', user: formatUser(user) });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out successfully.' });
  });
});

app.get('/api/dashboard', requireAuth, (req, res) => {
  const entries = db
    .prepare(
      `SELECT id, title, category, rating, vibe, date, created_at
       FROM entries
       WHERE user_id = ?
       ORDER BY date DESC, created_at DESC`
    )
    .all(req.session.userId);

  const categoryCounts = {};
  const vibeCounts = {};

  entries.forEach((entry) => {
    categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
    vibeCounts[entry.vibe] = (vibeCounts[entry.vibe] || 0) + 1;
  });

  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0] || ['No entries yet', 0];
  const totalEntries = entries.length;
  const averageRating = totalEntries
    ? (entries.reduce((sum, entry) => sum + Number(entry.rating), 0) / totalEntries).toFixed(1)
    : '0.0';

  res.json({
    entries,
    stats: {
      totalEntries,
      averageRating,
      topCategory: topCategory[0],
      categoryCounts,
      vibeCounts,
    },
  });
});

app.post('/api/entries', requireAuth, (req, res) => {
  const { date, title, category, rating, vibe } = req.body || {};

  if (!date || !title || !category || !rating || !vibe) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const trimmedTitle = String(title).trim();
  if (!trimmedTitle) {
    return res.status(400).json({ message: 'Title cannot be blank.' });
  }

  const selectedDate = new Date(String(date));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(selectedDate.getTime())) {
    return res.status(400).json({ message: 'Please enter a valid date.' });
  }

  if (selectedDate > today) {
    return res.status(400).json({ message: 'Future dates are not allowed.' });
  }

  const allowedCategories = ['Book', 'Music', 'Game', 'Movie'];
  const allowedVibes = ['Chill', 'Focused', 'Cozy', 'Energetic', 'Happy', 'Reflective'];

  if (!allowedCategories.includes(String(category))) {
    return res.status(400).json({ message: 'That category is not valid.' });
  }

  if (!allowedVibes.includes(String(vibe))) {
    return res.status(400).json({ message: 'That vibe is not valid.' });
  }

  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
  }

  const result = db
    .prepare(
      `INSERT INTO entries (user_id, date, title, category, rating, vibe)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(req.session.userId, String(date), trimmedTitle, String(category), numericRating, String(vibe));

  const entry = db
    .prepare(
      `SELECT id, title, category, rating, vibe, date, created_at
       FROM entries WHERE id = ?`
    )
    .get(result.lastInsertRowid);

  return res.status(201).json({ message: 'Entry created successfully.', entry });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`VibeCheck app running on http://localhost:${PORT}`);
});
