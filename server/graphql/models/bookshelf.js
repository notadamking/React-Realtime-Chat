import knex from 'knex';
import bookshelf from 'bookshelf';

import config from '../../../config';

const Knex = knex(config.dbConfig);
const Bookshelf = bookshelf(Knex);

/* eslint no-use-before-define: 0 */

const Comment = Bookshelf.Model.extend({
  tableName: 'comment',
  hasTimestamps: true,
  author() {
    return this.belongsTo(User, 'author_id');
  },
});

const User = Bookshelf.Model.extend({
  tableName: 'user',
  hasTimestamps: true,
  postedComments() {
    return this.hasMany(Comment);
  }
});

export {
  Comment,
  User,
};
