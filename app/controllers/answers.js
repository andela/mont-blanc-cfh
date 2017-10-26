/**
 * Module dependencies.
 */
// import mongoose from 'mongoose';
import Answer from '../models/answer';

/* eslint-disable no-console */

/**
 * find answer by id
 * @returns {void} void
 * @export
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @param {any} id
 */
export function answer(req, res, next, id) {
  Answer.load(id, (err, result) => {
    if (err) return next(err);
    if (!result) return next(new Error(`Failed to load answer ${id}`));
    req.answer = result;
    next();
  });
}

/**
 * Show an answer
 * @returns {void} description
 * @export
 * @param {any} req
 * @param {any} res
 */
export function show(req, res) {
  res.jsonp(req.answer);
}

/**
 * List of Answers
 * @returns {void} void
 * @export
 * @param {any} req
 * @param {any} res
 */
export function all(req, res) {
  Answer.find({ official: true }).select('-_id').exec((err, answers) => {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(answers);
    }
  });
}

/**
 * List of Answers (for Game class)
 * @returns {void} void
 * @export
 * @param {any} cb
 */
export function allAnswersForGame(cb) {
  Answer.find({ official: true }).select('-_id').exec((err, answers) => {
    if (err) {
      console.log(err);
    } else {
      cb(answers);
    }
  });
}
