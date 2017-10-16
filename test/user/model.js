/**
 * Module dependencies.
 */
var should = require('should'),
    app = require('../../server'),
    mongoose = require('mongoose'),
<<<<<<< HEAD:test/user/model.js
    User = mongoose.model('User');

//Globals
var user;

//The tests
describe('<Unit Test>', function() {
    describe('Model User:', function() {
        before(function(done) {
=======
    User = mongoose.model('User')
    // Article = mongoose.model('Article');

//Globals
// var user;
// var article;

//The tests
xdescribe('<Unit Test>', function() {
    describe('Model Article:', function() {
        beforeEach(function(done) {
>>>>>>> chore(grunt-to-gulp): convert grunt to gulp:test/article/model.js
            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password'
            });

            done();
        });

        describe('Method Save', function() {
            it('should be able to save whithout problems', function(done) {
                return user.save(function(err) {
                    should.not.exist(err);
                    done();
                });
            });

            it('should be able to show an error when try to save witout name', function(done) {
                user.name = '';
                return user.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });

        after(function(done) {
            done();
        });
    });
});