import knex from 'knex';
import bookshelf from 'bookshelf';

import config from '../../../config';

const Knex = knex(config.dbConfig);
const Bookshelf = bookshelf(Knex);

const User = Bookshelf.Model.extend({
  tableName: 'user',
  hasTimestamps: true,
});

export default {
  User,
};
