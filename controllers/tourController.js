const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/apiFeatures');

exports.createTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ name: req.body.name });

  if (tour) return next(new AppError('Tour Already Exist', 400));

  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newTour,
  });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const response = await features.query;

  if (response.length == 0)
    return next(new AppError('No avaliable tour found!', 404));

  res.status(200).json({
    result: response.length,
    status: 'success',
    data: response,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');

  if (!tour) return next(new AppError('TourID not found!'), 404);

  res.status(200).json({
    data: tour,
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedTour) return next(new AppError('TourID not found!', 404));

  res.status(200).json({
    status: 'success',
    data: updatedTour,
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const deletedTour = await Tour.findByIdAndDelete(req.params.id);

  if (!deletedTour) return next(new AppError('TourID not found!', 404));

  res.status(200).json({
    status: 'success',
    message: 'Tour deleted successfully',
  });
});
