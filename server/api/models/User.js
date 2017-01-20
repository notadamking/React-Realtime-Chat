import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';

import { pubsub } from '../utils/subscriptions';
import { isDevelopment, secretKey } from '../../../config';
import models from '../models';

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
    username: { type: DataTypes.STRING, allowNull: false },
    avatarUrl: { type: DataTypes.STRING, allowNull: false },
    hash: { type: DataTypes.STRING(60), allowNull: false },
    currentRoom: { type: DataTypes.STRING },
  }, {
    classMethods: {
      associate({ JoinedRoom, Message, Room }) {
        this.belongsToMany(Room, {
          through: {
            model: JoinedRoom
          },
          as: 'joinedRooms',
          foreignKey: 'userId',
          constraints: false,
        });
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
          return null;
        }
      },
      async updateCurrentRoom({ room, user }) {
        if (!user) {
          throw new Error('You must be logged in to update your current room.');
        }
        if (room) {
          models.JoinedRoom.findOrCreate({
            where: {
              roomName: room,
              userId: user.id,
            }
          });
        }

        const oldUser = await this.findOne({ where: { id: user.id } });
        const oldRoom = oldUser.toJSON().currentRoom;
        const updatedUser = await oldUser.update({ currentRoom: room });
        const updatedOnlineUsers = await this.findAll({ where: { currentRoom: room } });

        pubsub.publish('onlineUsersChanged', {
          room,
          users: updatedOnlineUsers
        });
        if (oldRoom && oldRoom !== room) {
          const usersInOldRoom = await this.findAll({ where: { currentRoom: oldRoom } });
          pubsub.publish('onlineUsersChanged', {
            room: oldRoom,
            users: usersInOldRoom
          });
        }

        return updatedUser.toJSON();
      },
      async createNewUser({ username, password }) {
        const exists = await this.findOne({ where: { username } });
        if (exists) {
          throw new Error('That username is already in use.');
        }

        const hash = await getPasswordHash(password);
        const avatarUrl = gravatar.url(username);
        const user = await this.create({ username, avatarUrl, hash });
        return {
          ...user.toJSON(),
          authToken: signJwt(user.id)
        };
      },
      async login({ username, password }) {
        const user = await this.findOne({ where: { username } });
        if (!user) {
          throw new Error('No user with that username exists.');
        } else if (!await validatePassword({ password, hash: user.hash })) {
          throw new Error('Invalid username or password.');
        }

        return {
          ...user.toJSON(),
          authToken: signJwt(user.id)
        };
      },
    }
  });
};
