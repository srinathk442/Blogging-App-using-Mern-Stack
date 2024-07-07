require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const User = require('./models/User');
const Post = require('./models/Post');

const app = express();

// Middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadMiddleware = multer({ dest: 'uploads/' });

mongoose.set('strictQuery', true);

async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}

connectMongoDB();

const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;

app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const userDoc = await User.create({
      email,
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (userDoc && bcrypt.compareSync(password, userDoc.password)) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to generate token' });
      }
      res.cookie('token', token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json({ error: 'Wrong credentials' });
  }
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(401).json({ error: 'Token is invalid' });
    }
    res.json(info);
  });
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json({ message: 'ok' });
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const { originalname, path: filePath } = req.file;
  const ext = path.extname(originalname);
  const newPath = filePath + ext;
  fs.renameSync(filePath, newPath);

  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(401).json({ error: 'Token is invalid' });
    }

    const { title, summary, content } = req.body;
    try {
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      res.json(postDoc);
    } catch (e) {
      console.error(e);
      res.status(400).json({ error: e.message });
    }
  });
});

app.put('/post/:id', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path: filePath } = req.file;
    const ext = path.extname(originalname);
    newPath = filePath + ext;
    fs.renameSync(filePath, newPath);
  }

  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(401).json({ error: 'Token is invalid' });
    }

    const { title, summary, content } = req.body;
    try {
      const postDoc = await Post.findById(req.params.id);
      if (String(postDoc.author) !== String(info.id)) {
        return res.status(400).json({ error: 'You are not the author' });
      }
      await postDoc.updateOne({
        title,
        summary,
        content,
        cover: newPath || postDoc.cover,
      });
      res.json(postDoc);
    } catch (e) {
      console.error(e);
      res.status(400).json({ error: e.message });
    }
  });
});

app.get('/post', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.get('/post/:id', async (req, res) => {
  try {
    const postDoc = await Post.findById(req.params.id).populate('author', ['username']);
    res.json(postDoc);
  } catch (e) {
    console.error(e);
    res.status(404).json({ error: 'Post not found' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
