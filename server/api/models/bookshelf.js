import knex from 'knex';
import bookshelf from 'bookshelf';

import config from '../../../config';

const Knex = knex(config.dbConfig);
const Bookshelf = bookshelf(Knex);

/* eslint no-use-before-define: 0 */

const Message = Bookshelf.Model.extend({
  tableName: 'message',
  hasTimestamps: true,
  author() {
    return this.belongsTo(User, 'author_id');
  },
});

const User = Bookshelf.Model.extend({
  tableName: 'user',
  hasTimestamps: true,
  postedMessages() {
    return this.hasMany(Message);
  }
});

export {
  Message,
  User,
};
