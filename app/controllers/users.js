/**
 * Module dependencies.
 */
import validator from 'validator';
import bcrypt from 'bcryptjs';
import User from '../models/user';


const allAvatars = require('./avatars').all();

/**
 * Auth callback
 * @returns {void} description
 * @export
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
export function authCallback(req, res) {
  if (!req.user) {
    res.redirect('/#!/signin?error=invalid');
  } else {
    res.cookie('token', req.user.generateJwt());
    res.redirect('/#!');
  }
}

/**
 * Show login form
 * @returns {void} description
 * @export
 * @param {any} req
 * @param {any} res
 */
export function signin(req, res) {
  if (!req.user) {
    res.redirect('/#!/signin?error=invalid');
  } else {
    res.redirect('/#!/app');
  }
}

/**
 * Show sign up form
 * @returns {void} description
 * @export
 * @param {any} req
 * @param {any} res
 */
export function signup(req, res) {
  if (!req.user) {
    res.redirect('/#!/signup');
  } else {
    res.redirect('/#!/app');
  }
}

/**
 * Logout function
 * @returns {void} description
 * @export
 * @param {any} req
 * @param {any} res
 */
export function signout(req, res) {
  req.logout();
  res.redirect('/');
}

/**
 * Sessions
 * @returns {void} description
 * @export
 * @param {any} req
 * @param {any} res
 */
export function session(req, res) {
  res.redirect('/');
}

/**
 * Check avatar - Confirm if the user who logged in via passport
 * already has an avatar. If they don't have one, redirect them
 * to our Choose an Avatar page.
 * @returns {void} description
 * @export
 * @param {any} req
 * @param {any} res
 */
export function checkAvatar(req, res) {
  if (req.user && req.user._id) {
    User.findOne({
      _id: req.user._id
    })
      .exec((err, response) => {
        if (response.avatar !== undefined) {
          res.redirect('/#!/');
        } else {
          res.redirect('/#!/choose-avatar');
        }
      });
  } else {
    // If user doesn't even exist, redirect to /
    res.redirect('/');
  }
}

/**
 * Create user
 * @export
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object} response object
 */
export function create(req, res) {
  const {
    name,
    password,
    email
  } = req.body;
  if (name && password && email) {
    User.findOne({
      email
    }).exec((err, existingUser) => {
      if (!existingUser) {
        const appUser = new User({
          name,
          password,
          email
        });
        /**
         * Switch the user's avatar index to an actual avatar url
         */
        appUser.avatar = allAvatars[appUser.avatar];
        appUser.provider = 'local';
        appUser.save((err) => {
          if (err) {
            return res.status(400).send({
              errors: err.errors.hashed_password.type,
              message: 'Failed'
            });
          }
          return res.status(201).send({
            message: 'Successfully signed up',
            token: appUser.generateJwt(),
            user: appUser
          });
        });
      } else {
        return res.status(409).send({
          message: 'Email already exists'
        });
      }
    });
  } else {
    return res.status(400).send({
      message: 'Details are required'
    });
  }
}
export const logIn = (req, res) => {
  const { email, password } = req.body;
  if (email) {
    if (password) {
      if (validator.isEmail(req.body.email)) {
        User.findOne({
          email
        }).then((existingUser) => {
          if (!existingUser) {
            return res.status(401).send({ message: 'You seem to have not registered this account with us' });
          }
          if (!bcrypt.compareSync(req.body.password, existingUser.hashed_password)) {
            return res.status(401).send({ message: 'Incorrect credentials' });
          }
          return res.status(200).send({
            token: existingUser.generateJwt(),
            message: 'Successfully logged in'
          });
        }).catch((err) => {
          if (err) {
            return res.status(500).send({ errors: 'Something went wrong' });
          }
        });
      } else {
        return res.status(400).send({ message: 'Emails are allowed only' });
      }
    } else {
      return res.status(400).send({ message: 'Password is required' });
    }
  } else {
    return res.status(400).send({ message: 'Email is required' });
  }
};
/**
 * Assign avatar to user
 * @export
 * @param {any} req
 * @param {any} res
 * @returns {object} response object
 */
export function avatars(req, res) {
  // Update the current user's profile to include the avatar choice they've made
  if (req.user && req.user._id && req.body.avatar !== undefined &&
    /\d/.test(req.body.avatar) && avatars[req.body.avatar]) {
    User.findOne({
      _id: req.user._id
    })
      .exec((err, response) => {
        response.avatar = avatars[req.body.avatar];
        response.save();
      });
  }
  return res.redirect('/#!/app');
}

/**
 * @returns {void} description
 * add donation
 * @export
 * @param {any} req
 * @param {any} res
 */
export function addDonation(req, res) {
  if (req.body && req.user && req.user._id) {
    // Verify that the object contains crowdrise data
    if (req.body.amount && req.body.crowdrise_donation_id && req.body.donor_name) {
      User.findOne({
        _id: req.user._id
      })
        .exec((err, response) => {
          // Confirm that this object hasn't already been entered
          let duplicate = false;
          for (let i = 0; i < user.donations.length; i + 1) {
            if (response.donations[i].crowdrise_donation_id === req.body.crowdrise_donation_id) {
              duplicate = true;
            }
          }
          if (!duplicate) {
            console.log('Validated donation');
            response.donations.push(req.body);
            response.premium = 1;
            response.save();
          }
        });
    }
  }
  res.send();
}

/**
 * @returns {void} description
 * get donation
 * @export
 * @param {any} req
 * @param {any} res
 */
export function getDonation(req, res) {
  if (req.decoded) {
    const userId = req.decoded._id;
    User.findById({
      _id: userId
    })
      .exec((err, userDonations) => {
        if (err) {
          return res.status(500).send({
            message: 'Donation not succesfully retrieved'
          });
        }
        return res.status(200).json(userDonations);
      });
  } else {
    return res.status(401).send({ message: 'Unauthenticated user' });
  }
}

/**
 * Show profile
 * @returns {void} description
 * @export
 * @param {any} req
 * @param {any} res
 */
export function show(req, res) {
  const gameUser = req.profile;
  res.render('users/show', {
    title: gameUser.name,
    user: gameUser
  });
}

/**
 * Send User
 * @returns {void} description
 * @export
 * @param {any} req
 * @param {any} res
 */
export function me(req, res) {
  res.jsonp(req.user || null);
}

/**
 * Find user by id
 * @returns {void} description
 * @export
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @param {any} id
 */
export function user(req, res, next, id) {
  User
    .findOne({
      _id: id
    })
    .exec((err, response) => {
      if (err) return next(err);
      if (!response) return next(new Error(`Failed to load User ${id}`));
      req.profile = response;
      next();
    });
}
