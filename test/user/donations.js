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
let token; // store token for user authentication
const expiredToken = jwt.sign({
  _id: 'h123h1h2hhhhhhs'
}, 'expired', {
  expiresIn: '0.001s'
});
const User = mongoose.model('User');

// delete all records in User model
User.collection.drop();

const userDetails = {
  name: 'Oluwadunsin Oyebiyi',
  password: 'password',
  email: 'ebenezer996.dawuda@gmail.com',

};

describe('Get donation using authenticated route', () => {
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

  it('should return 200 status code for successfully getting user donations', (done) => {
    server
      .get(`/api/v1/donations/${token}`)
      .end((err, res) => {
        expect(res).to.be.json;
        expect(res.body.donations.length).to.equal(0);
        expect(res.status).to.equal(200);
        if (err) return done(err);
        done();
      });
  });

  it('should return 401 status code and not get user donation when token is expired', (done) => {
    server
      .get(`/api/v1/donations/${expiredToken}`)
      .end((err, res) => {
        expect(res).to.be.json;
        expect(res.body.message).to.equal('Expired token');
        expect(res.status).to.equal(401);
        if (err) return done(err);
        done();
      });
  });
});

