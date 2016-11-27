const isDevelopment = process.env.NODE_ENV === 'development';

export default {
  env: process.env.NODE_ENV || 'development',
  meta: {
    title: 'React Redux Apollo Starter'
  },
  server: {
    host: 'localhost',
    port: isDevelopment ? 3000 : 8080,
  },
  secretKey: 'd98d1690-7f39-4676-830d-7cf8720b1475',
  dbConfig: {
    client: 'pg',
    connection: 'postgres://postgres:password@localhost:5432/boilerplate',
    searchPath: 'knex,public',
  },
  assetTransferPort: 3003,
  authTokenName: 'token',
  graphqlEndpoint: '/graphql',
  isDevelopment,
};
