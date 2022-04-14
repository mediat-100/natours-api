const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErorrHandler = require('./controllers/error');
const authRoutes = require('./routes/auth.route');

const app = express();

app.use(morgan('dev')); // logger

app.use(express.json()); //body-parser

app.use('/api/v1/auth', authRoutes);

// handling undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// global error handling middleware
app.use(globalErorrHandler);

module.exports = app;
