import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { pubsub } from '../utils/subscriptions';
import { isDevelopment, secretKey } from '../../../config';

const signJwt = (id) => {
  return jwt.sign({ id }, secretKey, { expiresIn: '7d' });
};

const validatePassword = async ({ password, hash }) => {
  if (!password || !hash) return false;
  return await bcrypt.compare(password, hash);
};

const getPasswordHash = async (password) => {
  const rounds = isDevelopment ? 8 : 12;
  const salt = await bcrypt.genSalt(rounds);
  return await bcrypt.hash(password, salt);
};

export default (sequelize, DataTypes) => {
  return sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false },
    hash: { type: DataTypes.STRING(60), allowNull: false },
    currentRoom: { type: DataTypes.STRING },
  }, {
    classMethods: {
      associate({ Message }) {
        this.hasMany(Message, { foreignKey: 'authorId' });
      },
      async getCurrentUser(authToken) {
        try {
          const { id } = await jwt.verify(authToken, secretKey);
          const user = await this.findById(id);
          return {
            ...user.toJSON(),
            authToken
          };
        } catch (error) {
          // throw new Error('Invalid or missing auth token.');
          return null;
        }
      },
      async getUsersInRoom(room) {
        const users = await this.findAll({ where: { currentRoom: room } });
        return users;
      },
      async updateCurrentRoom({ room, userId }) {
        const user = await this.findOne({ where: { id: userId } });
        const oldRoom = user.toJSON().currentRoom;
        const updatedUser = await user.update({ currentRoom: room });
        const updatedUsersInRoom = await this.findAll({ where: { currentRoom: room } });

        pubsub.publish('usersInRoomChanged', {
          room,
          users: updatedUsersInRoom
        });

        if (oldRoom && oldRoom !== room) {
          const usersInOldRoom = await this.findAll({ where: { currentRoom: oldRoom } });
          pubsub.publish('usersInRoomChanged', {
            room: oldRoom,
            users: usersInOldRoom
          });
        }

        return updatedUser.toJSON();
      },
      async createNewUser({ email, password }) {
        const exists = await this.findOne({ where: { email } });

        if (exists) {
          throw new Error('That email address is already in use.');
        }

        const hash = await getPasswordHash(password);
        const user = await this.create({ email, hash });
        return {
          ...user.toJSON(),
          authToken: signJwt(user.id)
        };
      },
      async login({ email, password }) {
        const user = await this.findOne({ where: { email } });

        if (!user) {
          throw new Error('No user with that email address exists.');
        } else if (!await validatePassword({ password, hash: user.hash })) {
          throw new Error('Invalid email or password.');
        }

        return {
          ...user.toJSON(),
          authToken: signJwt(user.id)
        };
      },
    }
  });
};
