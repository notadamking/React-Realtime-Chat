import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button, Form, Message } from 'semantic-ui-react';

import { clearSubmitErrors, setCommentSubmitError } from '../../../redux/actions/comments';
import { FormTextField } from '../../../components';
import styles from './NewCommentForm.css';
import postCommentMutation from './postComment.graphql';

@connect(
  (state) => ({
    submitError: (state.comments && state.comments.commentSubmitError) || null,
    user: (state.auth && state.auth.currentUser) || null,
  })
)
@graphql(postCommentMutation, {
  props: ({ ownProps, mutate }) => ({
    postComment: ({ content }) => mutate({
      variables: { content },
      optimisticResponse: {
        postComment: {
          __typename: 'NewComment',
          id: 0,
          comment: {
            __typename: 'Comment',
            id: 0,
            author: {
              __typename: 'User',
              id: 0,
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
        CommentList: (prev, { mutationResult }) => {
          return {
            comments: [
              mutationResult.data.postComment.comment,
              ...prev.comments
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
export default class NewCommentForm extends Component {
  async onSubmit({ content }) {
    const { dispatch, postComment, reset } = this.props;
    dispatch(clearSubmitErrors());
    const { data: { postComment: { error, comment } } } = await postComment({ content });
    if (comment) {
      reset();
    } else if (error) {
      dispatch(setCommentSubmitError(error));
    }
  }

  render() {
    const { handleSubmit, pristine, submitError, submitting } = this.props;
    return (
      <div>
        <Message content={submitError} error header='Comment Failed!' hidden={!submitError} />
        <Form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
          <div className={styles.commentBox}>
            <Field
              component={FormTextField}
              label='Leave a comment'
              name='content'
              rows={4}
            />
            <Button
              className={styles.submitCommentButton}
              color='green'
              content='Submit'
              disabled={pristine || submitting}
              inverted
              size='small'
              type='submit'
            />
          </div>
        </Form>
      </div>
    );
  }
}

NewCommentForm.propTypes = {
  dispatch: PropTypes.func,
  handleSubmit: PropTypes.func,
  postComment: PropTypes.func,
  pristine: PropTypes.bool,
  reset: PropTypes.func,
  submitError: PropTypes.string,
  submitting: PropTypes.bool,
  user: PropTypes.object,
};
