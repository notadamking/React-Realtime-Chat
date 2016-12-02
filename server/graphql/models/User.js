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

const normalizeUser = (aUser) => {
  const user = aUser.toJSON();
  return {
    ...user,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  };
};

const normalizeAuthedUser = (user, authToken = null) => {
  const normalizedUser = normalizeUser(user);
  return {
    id: normalizedUser.id,
    user: {
      ...normalizedUser,
      authToken: authToken || signJwt(user.id),
    }
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
      return normalizeAuthedUser(user, authToken);
    } catch (error) {
      return false;
    }
  },

  createNewUser: async ({ email, password }) => {
    const exists = await User.where({ email }).fetch();
    if (exists) {
      return { error: 'That email address is already in use.' };
    }
    const hash = await getPasswordHash(password);
    const user = await new User({ email, hash }).save();
    return normalizeAuthedUser(user);
  },

  login: async ({ email, password }) => {
    const user = await User.where({ email }).fetch();
    if (!user) {
      return { error: 'No user with that email address exists.' };
    } else if (!await validatePassword({ password, hash: user.attributes.hash })) {
      return { error: 'Invalid email or password.' };
    }
    return normalizeAuthedUser(user);
  },
};

export default UserModel;
