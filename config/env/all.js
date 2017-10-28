import path from 'path';

import dotenv from 'dotenv';

dotenv.config();

const rootPath = path.normalize(`${__dirname}/../..`);

export default {
  root: rootPath,
  port: process.env.PORT || 3000,
  db: process.env.MONGOHQ_URL,
  token: process.env.TOKEN_SECRET || process.env.TOKEN_KEY,
};
