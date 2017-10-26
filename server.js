/**
 * Module dependencies.
 */
import express from 'express';
import fs from 'fs';
import passport from 'passport';
import logger from 'mean-logger';
import io from 'socket.io';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import config from './config/config';
import auth from './config/middlewares/authorization';
import expressFunction from './config/express';
import routesFunction from './config/routes';
import socketFunction from './config/socket/socket';
import passportFunction from './config/passport';

/* eslint-disable global-require, import/no-dynamic-require, no-console */


dotenv.config();
const app = express();

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

/**
 * Bootstrap models
 */
const modelsPath = `${__dirname}/app/models`;
const walk = (path) => {
  fs.readdirSync(path).forEach((file) => {
    const newPath = `${path}/${file}`;
    const stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.(js|coffee)/.test(file)) {
        require(newPath);
      }
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};
walk(modelsPath);

app.use((req, res, next) => {
  next();
});

/**
 * Bootstrap routes
 */
routesFunction(app, passport, auth);

/**
 * Bootstrap passport config
 */
passportFunction(passport);

/**
 * express settings
 */
expressFunction(app, passport, mongoose);

/**
 * Bootstrap db connection
 */
mongoose.connect(config.db);
console.log(config.db, 'we are here ');


/**
 * Initializing logger
 */
logger.init(app, passport, mongoose);

/**
 * Start the app by listening on <port>
 */
const { port } = config;
const server = app.listen(port);
const ioObj = io.listen(server, { log: false });

/**
 * game logic handled here
 */
socketFunction(ioObj);
console.log(`Express app started on port ${port}`);


/**
 * expose app
 */
export default app;
