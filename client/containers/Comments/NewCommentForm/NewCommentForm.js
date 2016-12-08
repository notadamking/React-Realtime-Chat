import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Header } from 'semantic-ui-react';

import { NewCommentForm } from '../../../components';
import postCommentMutation from './postComment.graphql';

function isDuplicateComment(newComment, existingComments) {
  return newComment.id !== null && existingComments.some(comment => newComment.id === comment.id);
}

@connect(
  (state) => ({
    user: (state.auth && state.auth.currentUser) || null,
  })
)
@graphql(postCommentMutation, {
  props: ({ ownProps, mutate }) => ({
    postComment: (content) => mutate({
      variables: { content },
      optimisticResponse: {
        postComment: {
          __typename: 'NewComment',
          id: '0',
          comment: {
            __typename: 'Comment',
            id: '0',
            author: {
              __typename: 'User',
              id: '0',
              email: ownProps.user && ownProps.user.email,
            },
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          error: null
        }
      },
      updateQueries: {
        CommentList: (previousResult, { mutationResult }) => {
          const newComment = mutationResult.data.postComment.comment;

          if (!previousResult.comments || previousResult.comments.length < 1) {
            return { comments: [newComment] };
          }

          if (isDuplicateComment(newComment, previousResult.comments)) {
            return previousResult;
          }

          return {
            comments: [
              newComment,
              ...previousResult.comments
            ]
          };
        }
      }
    }),
  }),
})
@reduxForm({
  form: 'postComment'
})
export default class NewCommentFormContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitError: null,
    };
  }

  async onSubmit({ content }) {
    const { postComment, reset } = this.props;
    if (content) {
      reset();
      this.setState({ submitError: null });
    }

    const { data: { postComment: { error } } } = await postComment(content);

    if (error) {
      this.setState({ submitError: error });
    }
  }

  render() {
    const { submitError } = this.state;
    const { handleSubmit, pristine, submitting, user } = this.props;
    return user ? (
      <NewCommentForm
        pristine={pristine}
        submitError={submitError}
        submitting={submitting}
        onSubmit={handleSubmit(this.onSubmit.bind(this))}
      />
    ) : (
      <Header as='h4' content='Login to leave a comment.' />
    );
  }
}

NewCommentFormContainer.propTypes = {
  handleSubmit: PropTypes.func,
  postComment: PropTypes.func,
  pristine: PropTypes.bool,
  reset: PropTypes.func,
  submitting: PropTypes.bool,
  user: PropTypes.object,
};
