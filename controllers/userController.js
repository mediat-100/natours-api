const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const bodyObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      bodyObj[el] = obj[el];
    }
  });
  return bodyObj;
};

// getProfile middleware
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// edit profile
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password)
    return next(
      new AppError(
        'Please use the update password route for password update',
        400
      )
    );

  const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'email');

  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

// deactivating user account
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { status: 'inactive' });

  res.status(200).json({
    status: 'success',
    message: 'Account deleted successfully!',
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    results: users.length,
    status: 'success',
    data: users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new AppError('User does not exist!', 404));

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) return next(new AppError('User does not exist!', 404));

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) return next(new AppError('User does not exist!', 404));

  res.status(200).json({
    status: 'success',
    message: 'Account deleted successfully',
  });
});
