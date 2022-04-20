const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) return next(new AppError('User already exist', 400));

  const newUser = await User.create(req.body);

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
    expiresIn: '5d',
  });

  res.status(200).json({
    status: 'success',
    message: 'Registration successful',
    data: newUser,
    token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please input your email and password', 401));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  user.password = undefined;

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '5d',
  });

  res.status(200).json({
    status: 'success',
    message: 'Login Successful',
    data: user,
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    return next(
      new AppError('You are not logged in, Please log in to get access', 401)
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) return next(new AppError('User no longer exist', 400));

  // check if password was changed after token was issued
  if (user.changedPasswordAfter(decoded.iat))
    return next(
      new AppError('User recently changed password, Please log in again!', 401)
    );

  req.user = user;
  next();
});
