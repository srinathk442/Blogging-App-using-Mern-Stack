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

const allowedOrigins = [
  'http://localhost:3000',
  'https://lifestyleblender.vercel.app',
  'https://lifestyleblendclient.vercel.app'
];

// Middleware
app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.options('*', cors());

app.get("/", async (req, res) => {
  return res.status(200).json({ message: "Blog app server is up and running!" });
});


const uploadMiddleware = multer({ dest: 'uploads/' });

mongoose.set('strictQuery', true);

async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}

connectMongoDB();

const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;

let captchaStore = {}; // Temporary storage for CAPTCHAs

function generateCaptcha() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return captcha;
}

app.get('/generate-captcha', (req, res) => {
  const captcha = generateCaptcha();
  const captchaId = Date.now().toString();
  captchaStore[captchaId] = captcha;
  res.json({ captcha, captchaId });
});

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
  const { username, password, captchaId, captchaValue } = req.body;
  const storedCaptcha = captchaStore[captchaId];

  if (!storedCaptcha || storedCaptcha !== captchaValue) {
    return res.status(400).json({ error: 'Invalid CAPTCHA' });
  }

  try {
    const userDoc = await User.findOne({ username });
    if (userDoc && bcrypt.compareSync(password, userDoc.password)) {
      const token = jwt.sign({ username, id: userDoc._id }, secret, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true }).json({
        id: userDoc._id,
        username,
      });
    } else {
      res.status(400).json({ error: 'Wrong credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to login' });
  }
});





app.post('/logout', (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out successfully' });
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

  jwt.verify(token, secret, async (err, decoded) => {
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
        author: decoded.id,
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

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  jwt.verify(token, secret, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token is invalid' });
    }

    const { title, summary, content } = req.body;
    try {
      const postDoc = await Post.findById(req.params.id);
      if (!postDoc) {
        return res.status(404).json({ error: 'Post not found' });
      }
      if (String(postDoc.author) !== String(decoded.id)) {
        return res.status(400).json({ error: 'You are not the author' });
      }
      postDoc.title = title;
      postDoc.summary = summary;
      postDoc.content = content;
      postDoc.cover = newPath || postDoc.cover;
      await postDoc.save();
      res.json(postDoc);
    } catch (e) {
      console.error(e);
      res.status(400).json({ error: e.message });
    }
  });
});

app.delete('/post/:id', async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  jwt.verify(token, secret, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token is invalid' });
    }

    try {
      const postDoc = await Post.findById(req.params.id);
      if (!postDoc) {
        return res.status(404).json({ error: 'Post not found' });
      }
      if (String(postDoc.author) !== String(decoded.id)) {
        return res.status(400).json({ error: 'You are not the author' });
      }
      await postDoc.deleteOne();
      res.json({ message: 'Post deleted successfully' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to delete post' });
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
    if (!postDoc) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(postDoc);
  } catch (e) {
    console.error(e);
    res.status(404).json({ error: 'Post not found' });
  }
});

app.get('/search', async (req, res) => {
  const { title } = req.query;
  try {
    const posts = await Post.find({ title: { $regex: title, $options: 'i' } })
      .populate('author', ['username'])
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to search posts' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;