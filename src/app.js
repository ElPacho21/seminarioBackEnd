const express = require('express');
const cookiepParser = require('cookie-parser')
const passport = require('passport');
const cors = require('cors');
const path = require("path");
const morgan = require('morgan')

const { port } = require('./config/app.config')
const router = require('./routes');
const { socketio } = require('./socketio/socket');
const mongoConnect = require('../db');
const initializePassport = require('./config/passport.config');

// Express server

const app = express();

// Morgan
app.use(morgan('dev'))

// Middleware para permitir cross-origin
app.use(cors({ 
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

// CookieParser

app.use(cookiepParser()) // Parse cookies from request headers

// Passport
initializePassport()
app.use(passport.initialize())

// Base de Datos
mongoConnect();

// Rutas
router(app);

const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})

// Sockets
socketio(server);