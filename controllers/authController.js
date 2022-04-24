const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

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

  const user = await User.findOne({ email, status: 'active' }).select(
    '+password'
  );

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

// auth middleware
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

// user role permission middleware
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(
      new AppError('Email provided does not belong to any user', 404)
    );

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token(valid for 10mins)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    this.passwordResetToken = undefined;
    this.passwordResetExpires = undefined;

    user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.status(200).json({
    status: 'success',
    token,
    data: user,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.correctPassword(req.body.password, user.password)))
    return next(new AppError('The password inputted is incorrect', 400));

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  user.password = undefined;
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully',
    data: user,
    token,
  });
});
