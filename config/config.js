import allConfiguration from '../config/env/all';
import developmentConfiguration from '../config/env/development';
import productionConfiguration from '../config/env/production';
import testConfiguration from '../config/env/test';

const config = Object.assign(
  { },
  allConfiguration,
  developmentConfiguration[0],
  productionConfiguration[0],
  testConfiguration[0]
);

export default config;
