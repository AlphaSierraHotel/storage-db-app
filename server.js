require('dotenv').config();
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const { authenticateToken } = require('./auth');
const userRoutes = require('./routes/userRoutes');
const hddRoutes = require('./routes/hddRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
errorHandler

// const EventEmitter = require('events')
// class Emitter extends EventEmitter { }
// const myEmitter = new Emitter()
// myEmitter.on('log', (msg) => logEvents(msg))

const app = express();

// Middleware
app.use(logger);

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT;
const SECRET_KEY = process.env.JWT_SECRET || '$2a$10$dksBDZ/twDxLyUsjmG1ELOoeOZMWwLAD.5z1Dp4ioiSnmXMbuzWKm';

// Create a connection to the SQLite database
const db = new sqlite3.Database(process.env.DATABASE_URL, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to the SQLite database');
    }
});

// Example in-memory user data (replace with DB in production)
const users = [
    {
        id: 1,
        username: 'testuser',
        // password: '$2a$10$DQeD5xJ8DJJHZnF/n//6v.eJXvjHGR0mNl7j9lZOqZpS/U1NqiHtC' // hashed password for 'password123'
        password: '$2a$10$dksBDZ/twDxLyUsjmG1ELOoeOZMWwLAD.5z1Dp4ioiSnmXMbuzWKm'
    }
];

// Login endpoint using SQLite and environment variables
app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Query the database for the user by username
    const query = 'SELECT * FROM users WHERE username = ?';
    db.get(query, [username], (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Compare the password with the hashed password stored in the database
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
  
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
  
        // Generate JWT if credentials are valid
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
          expiresIn: '1h',
        });
  
        return res.json({ token });
      });
    });
  });

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'Token is missing' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token is invalid' });
        }
        req.user = decoded; // Add the decoded user info to the request
        next();
    });
};

// Only the login and init-admin routes should be accessible without authentication
// app.use('/users/login', userRoutes);  // No authentication needed
// app.use('/users/init-admin', userRoutes);  // No authentication needed for initializing the admin
// Home route
// app.get('/', (req, res) => {
app.get('/dashboard', verifyToken, (req, res) => {
    res.send('Welcome to the HDD Data Collection Dashboard');
});

// Global Authentication Middleware (applies to all routes)
// app.use(authenticateToken);

// Routes
app.use('/users', userRoutes);
app.use('/api-keys', apiKeyRoutes);
app.use('/hdd', hddRoutes);

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'static', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ error: "404 - Not Found" })
    } else {
        res.type('txt').send("404 - Not Found")
    }
})

app.use(errorHandler)

// Start server
const port = process.env.PORT || 6288;
app.listen(port, () => {
    // myEmitter.emit('log', `Server running on port ${port}`)
    console.log(`Server running on port ${port}`);
});
