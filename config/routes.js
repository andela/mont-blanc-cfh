import {
  allJSON
} from '../app/controllers/avatars';
import {
  play,
  render
} from '../app/controllers/index';
import {
  all as allQuestions,
  show as showQuestion,
  question
} from '../app/controllers/questions';
import {
  all as allAnswers,
  show as showAnswer,
  answer
} from '../app/controllers/answers';
import {
  signin,
  signup,
  checkAvatar,
  signout,
  addDonation,
  getDonation,
  avatars as userAvatars,
  create,
  search,
  sendInvite,
  logIn,
  me,
  session,
  show as showUser,
  authCallback,
  user
} from '../app/controllers/users';
import {
  requiresLogin
} from './middlewares/authorization';
import {
  createGameLogs,
  getLeaderboard,
  getGameLog
} from '../app/controllers/games';

export default (app, passport) => {
  // User Routes


  app.get('/signin', signin);
  app.get('/signup', signup);
  app.get('/chooseavatars', checkAvatar);
  app.get('/signout', signout);

  /**
   * Setting up the users api
   */
  app.post('/api/v1/users/invite', sendInvite);
  app.get('/api/v1/search/:username', search);
  app.post('/api/v1/auth/signup', create);
  app.post('/api/v1/auth/login', logIn);
  app.post('/users/avatars', userAvatars);

  // Donation Routes
  app.post('/donations', addDonation);
  app.get('/api/v1/donations/:token', requiresLogin, getDonation);

  app.post('/users/session', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: 'Invalid email or password.'
  }), session);

  app.get('/users/me', me);
  app.get('/users/:userId', showUser);

  // Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email'],
    failureRedirect: '/signin'
  }), signin);

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signin'
  }), authCallback);

  // Setting the github oauth routes
  app.get('/auth/github', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), signin);

  app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), authCallback);

  // Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), signin);

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), authCallback);

  // Setting the google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }), signin);

  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
  }), authCallback);

  // Finish with setting up the userId param
  app.param('userId', user);

  // Answer Routes
  app.get('/answers', allAnswers);
  app.get('/answers/:answerId', showAnswer);
  // Finish with setting up the answerId param
  app.param('answerId', answer);

  // Question Routes

  app.get('/questions', allQuestions);
  app.get('/questions/:questionId', showQuestion);
  // Finish with setting up the questionId param
  app.param('questionId', question);

  // Avatar Routes
  app.get('/avatars', allJSON);

  // Home route
  app.get('/play', play);
  app.get('/', render);

  // Game Routes
  app.post('/api/v1/games/:id/start', requiresLogin, createGameLogs);
  app.get('/api/v1/games/history/:token', requiresLogin, getGameLog);
  app.get('/api/v1/games/leaderboard', getLeaderboard);
};
