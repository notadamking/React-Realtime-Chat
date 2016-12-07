import { pubsub } from '../utils/subscriptions';
import { Comment } from './bookshelf';

const normalizeComment = (aComment) => {
  const comment = aComment.toJSON();
  return {
    ...comment,
    createdAt: comment.created_at,
    updatedAt: comment.updated_at
  };
};

const normalizeErrableComment = (newComment) => {
  const comment = normalizeComment(newComment);
  return {
    id: comment.id,
    comment
  };
};

const CommentModel = {
  getComments: async ({ offset = 0, limit = 10 }) => {
    const protectedLimit = (limit < 1 || limit > 20) ? 20 : limit;
    const comments = await Comment
      .query((qb) => {
        qb.offset(offset).limit(protectedLimit).orderBy('created_at', 'desc');
      })
      .fetchAll({ withRelated: ['author'] });
    return comments.map((comment) => normalizeComment(comment));
  },

  getById: async (id) => {
    const comment = await Comment.where({ id }).fetch({ withRelated: ['author'] });
    return normalizeComment(comment);
  },

  postNewComment: async ({ content, user }) => {
    if (!user) {
      return { error: 'You must be logged in to submit a comment' };
    }
    const newComment = await
      new Comment({
        content,
        author_id: user.id
      })
      .save();
    const comment = await Comment
      .where({ id: newComment.id })
      .fetch({ withRelated: ['author'] });

    pubsub.publish('newCommentsChannel', normalizeComment(comment));
    return normalizeErrableComment(comment);
  },

  removeComment: async ({ id, user }) => {
    const comment = await Comment
      .where({ id })
      .fetch({ withRelated: ['author'] });
    const deletedComment = normalizeErrableComment(comment);

    if (deletedComment.comment.author_id !== user.id) {
      return { error: `You cannot delete a comment that you didn't post` };
    }

    comment.destroy();
    return deletedComment;
  },
};

export default CommentModel;
