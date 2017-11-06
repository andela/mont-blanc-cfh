import path from 'path';

import dotenv from 'dotenv';

dotenv.config();

const rootPath = path.normalize(`${__dirname}/../..`);

const config = {
  root: rootPath,
  port: process.env.PORT || 3000,
  db: process.env.MONGOHQ_URL,
  secret: process.env.TOKEN_KEY
};

export default config;
