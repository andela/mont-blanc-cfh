/**
 * Module dependencies.
 */
const should = require('should'),
app = require('../../server'),
mongoose = require('mongoose'),
User = mongoose.model('User');
chai = require('chai');
chaiHttp = require ('chai-http');

require('dotenv').config();

chai.use(chaiHttp);

let user;

// delete all records in User model before each test
mongoose.model('User').collection.drop();

describe('Users', () => {
    beforeEach(()  => {
        user = {
            name: 'Full name',
            email: 'testtt@test.com',
            username: 'user',
            password: 'password'
        };
    });
  describe('Users', () => {
    it('should get token on successful sign up', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.token;
          res.body.should.have.message;
          res.body.token.should.be.string;
          res.body.message.should.equal('Successfully signed up');
          res.should.be.json;
          if (err) return expect(err.errors);
          done();
        });
    });
    it('should not get token on unsuccessful sign up', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({ name: user.name, email: user.email, username: user.username })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.message;
          res.body.message.should.equal('Details are required');
          res.should.be.json;
          done();
        });
    });
    it('should not get token on unsuccessful sign up', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({ name: user.name, email: user.email, username: user.username, password:user.password })
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have.message;
          res.body.message.should.equal('Email already exists');
          res.should.be.json;
          done();
        });
    });
  });
});
