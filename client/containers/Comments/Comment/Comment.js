import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { Comment } from '../../../components';
import deleteCommentMutation from './deleteComment.graphql';

@graphql(deleteCommentMutation, {
  props: ({ ownProps, mutate }) => ({
    deleteComment: () => mutate({
      variables: { id: ownProps.comment.id },
      optimisticResponse: {
        deleteComment: {
          __typename: 'DeletedComment',
          id: ownProps.comment.id,
          comment: {
            __typename: 'Comment',
            id: ownProps.comment.id,
          },
          error: null
        }
      },
      updateQueries: {
        CommentList: (previousResult, { mutationResult }) => {
          const deletedComment = mutationResult.data.deleteComment.comment;

          const remainingComments = previousResult.comments.filter((comment) => {
            return comment.id !== deletedComment.id;
          });

          return {
            comments: remainingComments
          };
        }
      }
    }),
  }),
})
@connect(
  (state) => ({
    user: (state.auth && state.auth.currentUser) || null,
  })
)
export default class CommentContainer extends Component {
  onDelete() {
    const { deleteComment } = this.props;
    deleteComment();
  }

  render() {
    const { comment, user } = this.props;
    const commentIsOwnedByUser = user && (comment.author.id === user.id);
    return (
      <Comment
        comment={comment}
        isRemovable={commentIsOwnedByUser}
        onDelete={this.onDelete.bind(this)}
      />
    );
  }
}

CommentContainer.propTypes = {
  comment: PropTypes.object.isRequired,
  deleteComment: PropTypes.func,
  user: PropTypes.object,
};
