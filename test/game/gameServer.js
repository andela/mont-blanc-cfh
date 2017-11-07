/**
 * Module dependencies.
 */
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import chai from 'chai';
import app from '../../server';

const {
  expect
} = chai;
const server = supertest(app);
const signupUrl = '/api/v1/auth/signup';
const gameUrl = `/api/v1/games/${'nmtys'}/start`;
const leaderboardUrl = '/api/v1/games/leaderboard';
let token; // store token for user authentication
const expiredToken = jwt.sign({
  _id: 'h123h1h2hhhhhhs'
}, 'expired', {
  expiresIn: '0.001s'
});
const User = mongoose.model('User');
const Game = mongoose.model('Game');
// delete all records in User model
User.collection.drop();
// delete all records in Game model
Game.collection.drop();

const userDetails = {
  name: 'Oluwadunsin Oyebiyi',
  password: 'password',
  email: 'ebenezer99.dawuda@gmail.com',

};
const gameData = {
  gameID: 'nmtys',
  gamePlayers: ['philnewman', 'temilaj', 'victoria'],
  gameRound: 7,
  gameWinner: 'victoria'
};

describe('Create game using authenticated route', () => {
  before((done) => {
    chai.request(app)
      .post(signupUrl)
      .send(userDetails)
      .end((err, res) => {
        if (err) return done(err);
        token = res.body.token;
        done();
      });
  });

  it('should return 201 status code for successfully creating a game log', (done) => {
    server
      .post(gameUrl)
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('x-token', token)
      .set('Content-Type', 'application/json')
      .type('form')
      .send(gameData)
      .end((err, res) => {
        expect(res).to.be.json;
        expect(res.body.message).to.equal('Success... game logs saved');
        expect(res.status).to.equal(201);
        if (err) return done(err);
        done();
      });
  });

  it('should return 403 status code and not create a game when token is not provided', (done) => {
    server
      .post(gameUrl)
      .set('Accept', 'application/json')
      .set('x-token', '')
      .type('form')
      .send(gameData)
      .end((err, res) => {
        expect(res).to.be.json;
        expect(res.body.message).to.equal('Token not provided');
        expect(res.status).to.equal(403);
        if (err) return done(err);
        done();
      });
  });

  it('should return 401 status code and not create a game when token is expired', (done) => {
    server
      .post(gameUrl)
      .set('Accept', 'application/json')
      .set('x-token', expiredToken)
      .type('form')
      .send(gameData)
      .end((err, res) => {
        expect(res).to.be.json;
        expect(res.body.message).to.equal('Expired token');
        expect(res.status).to.equal(401);
        if (err) return done(err);
        done();
      });
  });
});


describe('Leaderboard route', () => {
      it('should load leaderboard', (done) => {
        server
          .get(leaderboardUrl)
          .set('Connection', 'keep alive')
          .set('Accept', 'application/json')
          .set('x-token', token)
          .set('Content-Type', 'application/json')
          .type('form')
          .end((err, res) => {
            expect(res).to.be.json;
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('leaderboard');
            expect(res.body.message).to.be.equal('Game leaderboard successfully retrieved');
            expect(res.body.success).to.be.equal(true);
            expect(res.body.leaderboard).to.include({
              victoria: 1
            });
            expect(res.body.leaderboard).to.have.property('victoria');
            if (err) return done(err);
            done();
          });
      });
