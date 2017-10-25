import mongoose from 'mongoose';

import answersArrayOfObj from './answers';
import questionsArrayOfObj from './questions';

require('dotenv').config();

const { Schema } = mongoose;
mongoose.connect(process.env.MONGOHQ_URL);
mongoose.Promise = global.Promise;

/**
 * Answer Schema
 */
const AnswerSchema = new Schema({
  id: {
    type: Number
  },
  text: {
    type: String,
    default: '',
    trim: true
  },
  official: {
    type: Boolean
  },
  expansion: {
    type: String,
    default: '',
    trim: true
  }
});


/**
 * Question Schema
 */
const QuestionSchema = new Schema({
  id: {
    type: Number
  },
  text: {
    type: String,
    default: '',
    trim: true
  },
  numAnswers: {
    type: Number
  },
  official: {
    type: Boolean
  },
  expansion: {
    type: String,
    default: '',
    trim: true
  }
});


const Answer = mongoose.model('answers', AnswerSchema);
const Question = mongoose.model('questions', QuestionSchema);

/**
 * Drops answers collection
 */
Question.collection.drop();

/**
 * Drop questiopns collection
 */
Answer.collection.drop();

/**
 * Creat and seed answer collection
 */
answersArrayOfObj.forEach((arrayElement) => {
  const answer = new Answer(arrayElement);
  answer.save((err) => {
    if (err) {
      return err;
    }
    return `seeded answer number ${arrayElement.id}`;
  });
});

/**
 * Creat and seed question collection
 */
questionsArrayOfObj.forEach((arrayElement) => {
  const question = new Question(arrayElement);
  question.save((err) => {
    if (err) {
      return err;
    }
    return `seeded question number ${arrayElement.id}`;
  });
});

