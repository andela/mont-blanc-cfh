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
            email: 'testt@test.com',
            username: 'user',
            password: 'password'
        };
    });
  describe('Users', () => {
    it('should get token on successful sign up', (done) => {
      testUser = Object.assign({}, user);
      chai.request(app)
        .post('/api/auth/signup')
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.token;
          res.body.should.have.message;
          res.body.token.should.be.string;
          res.body.message.should.equal('Successfully signed up');
          res.should.be.json;
          if (err) return expect(err.message);
          done();
        });
    });
  });
});