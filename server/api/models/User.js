import Promise from 'bluebird';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

import config from '../../../config';
import { User } from './bookshelf';

const bcrypt = Promise.promisifyAll(bcryptjs);
const verifyJwt = Promise.promisify(jwt.verify);

const signJwt = (id) => {
  return jwt.sign({ id }, config.secretKey, { expiresIn: '7d' });
};

const normalizeUser = (aUser, withToken = false) => {
  const user = aUser.toJSON();
  return {
    ...user,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    authToken: withToken ? signJwt(user.id) : null
  };
};

const validatePassword = async ({ password, hash }) => {
  if (!password || !hash) return false;
  return await bcrypt.compareAsync(password, hash);
};

const getPasswordHash = async (password) => {
  const rounds = config.isDevelopment ? 10 : 12;
  const salt = await bcrypt.genSaltAsync(rounds);
  return await bcrypt.hashAsync(password, salt);
};

const UserModel = {
  getById: async (id) => {
    const user = await User.where({ id }).fetch();
    return normalizeUser(user);
  },

  getCurrentUser: async (authToken) => {
    try {
      const { id } = await verifyJwt(authToken, config.secretKey);
      const user = await User.where({ id }).fetch();
      return normalizeUser(user, true);
    } catch (error) {
      return null;
    }
  },

  createNewUser: async ({ email, password }) => {
    const exists = await User.where({ email }).fetch();
    if (exists) {
      throw new Error('That email address is already in use.');
    }
    const hash = await getPasswordHash(password);
    const user = await new User({ email, hash }).save();
    return normalizeUser(user, true);
  },

  login: async ({ email, password }) => {
    const user = await User.where({ email }).fetch();
    if (!user) {
      throw new Error('No user with that email address exists.');
    } else if (!await validatePassword({ password, hash: user.attributes.hash })) {
      throw new Error('Invalid email or password.');
    }
    return normalizeUser(user, true);
  },
};

export default UserModel;
