/**
 * Module dependencies.
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server';

dotenv.config();
chai.use(chaiHttp);
const { expect } = chai;
// delete all records in User model before each test
mongoose.model('User').collection.drop();

const firstUser = {
  email: 'tester@test.com',
  password: 'password'
};
const secondUser = {
  email: 'tester@test.com',
  password: 'passw'
};

describe('Users', () => {
  it('should get token on successful login', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(firstUser)
      .end((err, res) => {
        res.should.return.status(200);
        res.body.should.return.token;
        res.body.should.return.message;
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
        res.should.return.status(400);
        res.body.should.return.message;
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
        res.should.return.status(400);
        res.body.should.return.message;
        res.body.message.should.equal('Email is required');
        res.should.be.json;
        done();
      });
  });
  it('should not login with incorrect credentials', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({ secondUser })
      .end((err, res) => {
        res.should.return.status(401);
        res.body.should.return.message;
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
        res.should.return.status(400);
        res.body.should.return.message;
        res.body.message.should.equal('Emails are allowed only');
        res.should.be.json;
        done();
      });
  });
});
