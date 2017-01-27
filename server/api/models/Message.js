import { pubsub } from '../utils/subscriptions';
import models from '../models';

export default (sequelize, DataTypes) => {
  return sequelize.define('message', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    room: { type: DataTypes.STRING },
    channel: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.STRING(8192), allowNull: false },
  }, {
    classMethods: {
      associate({ User }) {
        this.belongsTo(User, { as: 'author' });
      },
      async getChannelsForRoom(room) {
        const channels = await this.aggregate('channel', 'DISTINCT', {
          plain: false,
          where: { room }
        });
        return channels.map((channel) => channel.DISTINCT);
      },
      async getMessages({ room, channel, offset = 0, limit = 10, user = null }) {
        const protectedLimit = (limit < 1 || limit > 50) ? 50 : limit;
        const where = { room };
        if (channel.charAt(0) === '@') {
          const otherUser = await models.User.findOne({
            where: { username: channel.slice(1) }
          });
          where.$or = [{
            channel,
            authorId: user && user.id,
          }, {
            channel: `@${user && user.username}`,
            authorId: otherUser.toJSON().id,
          }];
        } else {
          where.channel = channel;
        }

        const messages = await this.findAll({
          where,
          include: [{ model: models.User, as: 'author' }],
          offset,
          limit: protectedLimit,
          order: [['createdAt', 'DESC']],
        });
        return messages.map((message) => message.toJSON());
      },
      async deleteMessage({ id, user }) {
        const message = await this.findById(id, {
          include: [{ model: models.User, as: 'author' }]
        });

        if (message.authorId !== user.id) {
          throw new Error(`You cannot delete a message that you didn't post`);
        }

        const deletedMessage = message.toJSON();

        message.destroy();
        if (message.channel.charAt(0) === '@') {
          const otherUser = await models.User.findOne({
            where: { username: message.channel.slice(1) }
          });
          pubsub.publish('messageDeleted', {
            ...deletedMessage,
            otherUser: otherUser.toJSON(),
          });
        } else {
          pubsub.publish('messageDeleted', deletedMessage);
        }

        return deletedMessage;
      },
      async postNewMessage({ room, channel, content, user }) {
        if (!user) {
          throw new Error('You must be logged in to submit a message');
        }

        const existingChannels = await this.getChannelsForRoom(room);
        const message = await this.create({
          room,
          channel,
          content,
          authorId: user.id
        });
        const author = await message.getAuthor();
        const newMessage = {
          ...message.toJSON(),
          author: author.toJSON()
        };

        if (channel.charAt(0) === '@') {
          const otherUser = await models.User.findOne({
            where: { username: channel.slice(1) }
          });
          pubsub.publish('messageAdded', {
            ...newMessage,
            otherUser: otherUser.toJSON(),
          });
        } else {
          pubsub.publish('messageAdded', newMessage);
        }

        if (!existingChannels.includes(channel)) {
          pubsub.publish('channelsInRoomChanged', {
            room,
            channels: [...existingChannels, channel],
          });
        }

        return newMessage;
      },
    }
  });
};
