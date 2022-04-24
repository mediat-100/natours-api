const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErorrHandler = require('./controllers/errorController');
const authRouter = require('./routes/authRoute');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');

const app = express();

app.use(morgan('dev')); // logger

app.use(express.json()); //body-parser

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// handling undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// global error handling middleware
app.use(globalErorrHandler);

module.exports = app;
