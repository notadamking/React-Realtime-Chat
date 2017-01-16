/* eslint-disable import/no-commonjs */

const isDevelopment = process.env.NODE_ENV === 'development';

/* Heroku binds a port and database url to process.env, we are
*  required to use them when using Heroku.
*/
const productionPort = process.env.PORT || 8080;
const localDbUrl = 'postgres://postgres:password@localhost:5432/boilerplate';
const productionDbUrl = process.env.DATABASE_URL || localDbUrl;

module.exports = {
  env: process.env.NODE_ENV || 'development',
  meta: {
    title: 'React Redux Apollo Starter'
  },
  server: {
    host: 'localhost',
    port: isDevelopment ? 3000 : productionPort,
  },
  secretKey: 'd98d1690-7f39-4676-830d-7cf8720b1475',
  dbUrl: isDevelopment ? localDbUrl : productionDbUrl,
  devServerPort: 3001,
  assetTransferPort: 3003,
  authTokenName: 'token',
  graphqlEndpoint: '/api/graphql',
  isDevelopment,
};
