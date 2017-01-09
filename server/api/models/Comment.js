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

const normalizeCommentFeedUpdate = (aComment, action) => {
  const comment = normalizeComment(aComment);
  return {
    comment,
    action
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
      throw new Error('You must be logged in to submit a comment');
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

    pubsub.publish('commentFeedChannel', normalizeCommentFeedUpdate(comment, 'add'));

    return normalizeComment(comment);
  },

  deleteComment: async ({ id, user }) => {
    const comment = await Comment
      .where({ id })
      .fetch({ withRelated: ['author'] });
    const deletedComment = normalizeComment(comment);

    if (deletedComment.author_id !== user.id) {
      throw new Error(`You cannot delete a comment that you didn't post`);
    }

    comment.destroy();
    pubsub.publish('commentFeedChannel', normalizeCommentFeedUpdate(comment, 'delete'));

    return deletedComment;
  },
};

export default CommentModel;
