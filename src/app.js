const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const passport = require('passport');
const httpStatus = require('http-status');
const path = require('path');
const cors = require('./config/cors');
const database = require('./config/database');
const { jwtStrategy } = require('./config/passport');
const { server } = require('./config/env');
const morgan = require('./config/morgan');
const ApiError = require('./utils/ApiError');
const routes = require('./routes');
const { authLimiter } = require('./middlewares/rateLimiter');
const { errorConverter, errorHandler } = require('./middlewares/error');

const app = express();

// setup logger
if (server.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

// setup database
database.connect();

// Setup BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup CookieParser
app.use(cookieParser());

// set security HTTP headers
app.use(helmet());

// parse json & urlencoded request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// setup cors
cors(app);

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (server.env === 'production') {
    app.use('/api/auth', authLimiter);
}

// api routes
app.use('/api', routes);

// public directories
app.use('/public', express.static(path.join(__dirname, './../public')));

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Route not found'));
});

// convert error to ApiError
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
