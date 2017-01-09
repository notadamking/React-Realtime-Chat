import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { Header } from 'semantic-ui-react';

import { NewCommentForm } from '../../../components';
import { setShouldScrollToBottom } from '../../../redux/actions/comments';
import postCommentMutation from './postComment.graphql';

function isDuplicateComment(newComment, existingComments) {
  return newComment && existingComments.length > 0
          && existingComments.some(comment => newComment.id === comment.id);
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
          __typename: 'Comment',
          id: '0',
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          author: {
            __typename: 'User',
            id: '0',
            email: ownProps.user && ownProps.user.email,
          },
          error: null
        }
      },
      updateQueries: {
        CommentList: (previousResult, { mutationResult }) => {
          if (isDuplicateComment(mutationResult.data.postComment, previousResult.comments)) {
            return previousResult;
          }

          setTimeout(() => ownProps.dispatch(setShouldScrollToBottom()), 50);

          return {
            comments: [mutationResult.data.postComment, ...previousResult.comments]
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
  dispatch: PropTypes.func,
  handleSubmit: PropTypes.func,
  postComment: PropTypes.func,
  pristine: PropTypes.bool,
  reset: PropTypes.func,
  submitting: PropTypes.bool,
  user: PropTypes.object,
};
