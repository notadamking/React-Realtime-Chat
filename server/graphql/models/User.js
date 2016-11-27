import Promise from 'bluebird';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import config from '../../../config';
import { User } from './bookshelf';

const bcrypt = Promise.promisifyAll(bcryptjs);
const verifyJwt = Promise.promisify(jwt.verify);

const UserModel = {
  async getById(id) {
    const user = await User.where({ id }).fetch();
    return user.toJSON();
  },

  async getAll() {
    const users = await User.fetchAll();
    return users.map(user => user.toJSON());
  },

  authedUser(user, authToken = null) {
    return {
      user: user.toJSON(),
      authToken: authToken || this.signJwt(user.id),
    };
  },

  async login({ email, password }) {
    const user = await User.where({ email }).fetch();
    if (!user) {
      return {
        error: 'No user with that email address exists.'
      };
    } else if (!await this.validatePassword({ password, hash: user.attributes.hash })) {
      return {
        error: 'Invalid email or password.'
      };
    }
    return this.authedUser(user);
  },

  async createNewUser({ name, email, password }) {
    const exists = await User.where({ email }).fetch();
    if (exists) {
      return {
        error: 'That email address is already in use.'
      };
    }
    const hash = await this.getPasswordHash(password);
    const user = await new User({ name, email, hash }).save();
    return this.authedUser(user);
  },

  async getCurrentUser(authToken) {
    try {
      const { id } = await verifyJwt(authToken, config.secretKey);
      const user = await User.where({ id }).fetch();
      return this.authedUser(user, authToken);
    } catch (error) {
      return false;
    }
  },

  signJwt(id) {
    return jwt.sign({ id }, config.secretKey, { expiresIn: '7d' });
  },

  async validatePassword({ password, hash }) {
    if (!password || !hash) return false;
    return await bcrypt.compareAsync(password, hash);
  },

  async getPasswordHash(password) {
    const rounds = config.isDevelopment ? 10 : 12;
    const salt = await bcrypt.genSaltAsync(rounds);
    return await bcrypt.hashAsync(password, salt);
  },
};

export default UserModel;
