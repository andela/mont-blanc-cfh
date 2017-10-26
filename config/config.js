import allConfiguration from '../config/env/all';
import developmentConfiguration from '../config/env/development.json';
import productionConfiguration from '../config/env/production.json';
import testConfiguration from '../config/env/test.json';

const config = Object.assign(
  { },
  allConfiguration,
  developmentConfiguration,
  productionConfiguration,
  testConfiguration
);

export default config;
