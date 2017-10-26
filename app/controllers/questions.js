/**
 * Module dependencies.
 */
// import mongoose from 'mongoose';

// const Question = mongoose.model('Question');
import Question from '../models/question';

/* eslint-disable no-console */

/**
 * Find question by id
 * @returns {void} description
 * @export
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @param {any} id
 */
export function question(req, res, next, id) {
  Question.load(id, (err, questions) => {
    if (err) return next(err);
    if (!questions) return next(new Error(`Failed to load question ${id}`));
    req.question = questions;
    next();
  });
}

/**
 * Show an question
 * @returns {void} description
 * @export
 * @param {any} req
 * @param {any} res
 */
export function show(req, res) {
  res.jsonp(req.question);
}

/**
 * List of Questions
 * @returns {void} description
 * @export
 * @param {any} req
 * @param {any} res
 */
export function all(req, res) {
  Question.find({ official: true, numAnswers: { $lt: 3 } }).select('-_id').exec((err, questions) => {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(questions);
    }
  });
}

/**
 * List of Questions (for Game class)
 * @returns {void} description
 * @export
 * @param {any} cb
 */
export function allQuestionsForGame(cb) {
  Question.find({ official: true, numAnswers: { $lt: 3 } }).select('-_id').exec((err, questions) => {
    if (err) {
      console.log(err);
    } else {
      cb(questions);
    }
  });
}
