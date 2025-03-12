const express = require('express');
const handlebars = require('express-handlebars');
const cookiepParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const passport = require('passport');
const cors = require('cors');

const { port } = require('./config/app.config')
const { dbAdmin, dbPassword, dbHost, dbName } = require('./config/db.config')
const router = require('./routes');
const { socketio } = require('./socketio/socket');
const mongoConnect = require('../db');
const initializePassport = require('./config/passport.config');

// Express server

const app = express();

// Middleware para permitir cross-origin
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))

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

// Handlebars

// * Helpers 
const hbs = handlebars.create({
    extname: '.handlebars',
    defaultLayout: 'main',
    helpers: {
        multiply: (a, b) => a * b,
        add: (a, b) => a + b,
        reduce: (array, initialValue) => 
            array.reduce((acc, item) => acc + item.price * item.quantity, initialValue)
    },
});

app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')

// Base de Datos
mongoConnect();

// Rutas
router(app);

const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})

// Sockets
socketio(server);