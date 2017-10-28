/**
 * Module dependencies.
 */
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../../config/config';

/* eslint-disable no-underscore-dangle, no-console, no-shadow */

const authTypes = ['github', 'twitter', 'facebook', 'google'];

/**
 * User Schema
 * Premiuim value is null or 0 for non-donors, 1 for everyone else (for now)
 */
const UserSchema = mongoose.Schema({
  name: String,
  email: String,
  username: String,
  provider: String,
  avatar: String,
  premium: Number,
  donations: [],
  hashed_password: String,
  facebook: {},
  twitter: {},
  github: {},
  google: {}
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function (password) {
  this._password = password;
  this.hashed_password = this.encryptPassword(password);
})
  .get(function () {
    return this._password;
  });

/**
 * Validations
 * @param {*} value
 * @returns {object} value
 */
const validatePresenceOf = value => value && value.length;


/**
 * the below 4 validations only apply if you are signing up traditionally
 */

/**
 * if you are authenticating by any of the oauth strategies, don't validate
 */
UserSchema.path('name').validate(function (name) {
  if (authTypes.includes(this.provider)) {
    return true;
  }
  return name.length;
}, 'Name cannot be blank');

/**
 * if you are authenticating by any of the oauth strategies, don't validate
 */
UserSchema.path('email').validate(function (email) {
  if (authTypes.includes(this.provider)) {
    return true;
  }
  return email.length;
}, 'Email cannot be blank');

/**
 * if you are authenticating by any of the oauth strategies, don't validate
 */
UserSchema.path('username').validate(function (username) {
  if (authTypes.includes(this.provider)) {
    return true;
  }
  return username.length;
}, 'Username cannot be blank');

/**
 * if you are authenticating by any of the oauth strategies, don't validate
 */
UserSchema.path('hashed_password').validate(function (hashedPassword) {
  if (authTypes.includes(this.provider)) {
    return true;
  }
  return hashedPassword.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
  if (!this.isNew) {
    return next();
  }
  if (!validatePresenceOf(this.password) && !authTypes.includes(this.provider)) {
    next(new Error('Invalid password'));
  } else {
    next();
  }
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   * @param {String} plainText
   * @returns {Boolean} checks for hashed password
   * @api public
   */
  authenticate(plainText) {
    if (!plainText || !this.hashed_password) {
      return false;
    }
    return bcrypt.compareSync(plainText, this.hashed_password);
  },

  /**
   * @param {String} password
   * @returns {String} encrypted password
   */
  encryptPassword(password) {
    if (!password) return '';
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }
};

UserSchema.methods.generateJwt = function () {
  const expiryDate = 60 * 60 * 24;

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiryDate / 1000, 10),
  }, config.token);
};

export default mongoose.model('User', UserSchema);
