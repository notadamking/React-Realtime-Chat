import { pubsub } from '../utils/subscriptions';
import { Message } from './bookshelf';

const normalizeMessage = (aMessage) => {
  const message = aMessage.toJSON();
  return {
    ...message,
    createdAt: message.created_at,
    updatedAt: message.updated_at
  };
};

const normalizeMessageFeedUpdate = (aMessage, action) => {
  const message = normalizeMessage(aMessage);
  return {
    message,
    action
  };
};

const MessageModel = {
  getMessages: async ({ offset = 0, limit = 10 }) => {
    const protectedLimit = (limit < 1 || limit > 20) ? 20 : limit;
    const messages = await Message
      .query((qb) => {
        qb.offset(offset).limit(protectedLimit).orderBy('created_at', 'desc');
      })
      .fetchAll({ withRelated: ['author'] });
    return messages.map((message) => normalizeMessage(message));
  },

  getById: async (id) => {
    const message = await Message.where({ id }).fetch({ withRelated: ['author'] });
    return normalizeMessage(message);
  },

  postNewMessage: async ({ content, user }) => {
    if (!user) {
      throw new Error('You must be logged in to submit a message');
    }
    const newMessage = await
      new Message({
        content,
        author_id: user.id
      })
      .save();
    const message = await Message
      .where({ id: newMessage.id })
      .fetch({ withRelated: ['author'] });

    pubsub.publish('messageFeedChannel', normalizeMessageFeedUpdate(message, 'add'));

    return normalizeMessage(message);
  },

  deleteMessage: async ({ id, user }) => {
    const message = await Message
      .where({ id })
      .fetch({ withRelated: ['author'] });
    const deletedMessage = normalizeMessage(message);

    if (deletedMessage.author_id !== user.id) {
      throw new Error(`You cannot delete a message that you didn't post`);
    }

    message.destroy();
    pubsub.publish('messageFeedChannel', normalizeMessageFeedUpdate(message, 'delete'));

    return deletedMessage;
  },
};

export default MessageModel;
