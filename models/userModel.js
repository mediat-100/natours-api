const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide your first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your last name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    min: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'lead-guide', 'guide'],
    default: 'user',
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  bodyPassword,
  userPassword
) {
  return await bcrypt.compare(bodyPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTimeStamp) {
  if (this.passwordChangedAt) {
    passwordChangeTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTimeStamp < passwordChangeTime;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
