/**
 * Module dependencies.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server';
import User from '../../app/models/user';

dotenv.config();
chai.use(chaiHttp);
const { expect } = chai;

const firstUser = {
  email: 'testttt@test.com',
  password: 'password'
};
const secondUser = {
  email: 'testttt@test.com',
  password: 'pass'
};

mongoose.model('User').collection.drop();
let user;
const appUser = new User({
  name: 'Full name',
  email: 'testttt@test.com',
  username: 'user',
  password: 'password'
});
appUser.save();
describe('Users', () => {
  it('should get token on successful login', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(firstUser)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.token;
        res.body.should.have.message;
        res.body.token.should.be.string;
        res.body.message.should.equal('Successfully logged in');
        res.should.be.json;
        if (err) return expect(err.errors);
        done();
      });
  });
  it('should not log in without password', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({ email: firstUser.email })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.message;
        res.body.message.should.equal('Password is required');
        res.should.be.json;
        done();
      });
  });
  it('should not log in without email', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({ password: firstUser.password })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.message;
        res.body.message.should.equal('Email is required');
        res.should.be.json;
        done();
      });
  });
  it('should not login with incorrect credentials', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(secondUser)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.message;
        res.body.message.should.equal('Incorrect credentials');
        res.should.be.json;
        done();
      });
  });
  it('should not login with invalid credentials', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'sbjhks',
        password: 'sjbhjsk'
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.message;
        res.body.message.should.equal('Emails are allowed only');
        res.should.be.json;
        done();
      });
  });
});
