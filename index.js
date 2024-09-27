require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { authenticateToken } = require('./auth');
const userRoutes = require('./routes/userRoutes');
const hddRoutes = require('./routes/hddRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');
const logEvents = require('./logEvents')

const EventEmitter = require('events')
class MyEmitter extends EventEmitter {}

// Initialize object
const myEmitter = new MyEmitter()

// add listener for the log event
myEmitter.on('log', (msg) => logEvents(msg))

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Only the login and init-admin routes should be accessible without authentication
app.use('/users/login', userRoutes);  // No authentication needed
// app.use('/users/init-admin', userRoutes);  // No authentication needed for initializing the admin
// Home route (optional)
app.get('/', (req, res) => {
    res.send('Welcome to the HDD Data Collection App');
});

// Global Authentication Middleware (applies to all routes)
//app.use(authenticateToken);

// Routes
app.use('/users', userRoutes);
app.use('/api-keys', apiKeyRoutes);
app.use('/api/hdd', hddRoutes);



// Start server
const port = process.env.PORT || 6288;
app.listen(port, () => {
    // setTimeout(() => {
    //     // Emit event
        myEmitter.emit('log', `Server running on port ${port}`)
    // }, 2000)    
    console.log(`Server running on port ${port}`);
});
