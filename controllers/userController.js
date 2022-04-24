const jwt = require('jsonwebtoken');
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

exports.updateUser = catchAsync(async (req, res, next) => {
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

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '5d',
  });

  res.status(200).json({
    status: 'success',
    data: user,
    token,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { status: 'inactive' });

  res.status(200).json({
    status: 'success',
    message: 'Account deleted successfully!'
  })
});
