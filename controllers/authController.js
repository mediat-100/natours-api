const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) return next(new AppError('User already exist', 400));

  if (!user) await User.create(req.body);

  res.status(200).json({
    status: 'success',
    message: 'Registration successful',
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

  res.status(200).json({
    status: 'success',
    message: 'Login Successful',
    data: {
      user,
    },
  });
});
