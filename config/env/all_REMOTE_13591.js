var path = require('path');
var dotenv = require('dotenv');
dotenv.config();

var rootPath = path.normalize(__dirname + '/../..');
var keys = rootPath + '/keys.txt';

require('dotenv').config();

module.exports = {
    root: rootPath,
    port: process.env.PORT || 3000,
    db: process.env.MONGOHQ_URL,
    token: process.env.TOKEN_SECRET || process.env.TOKEN_KEY,
};
