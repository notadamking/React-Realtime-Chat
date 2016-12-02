import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { Comment as UIComment } from 'semantic-ui-react';

import { NewCommentForm } from '../../';
import { Comment } from '../../../components';
import commentListQuery from './commentList.graphql';
import styles from './CommentList.css';

const COMMENTS_PER_FETCH = 10;

@connect(
  (state) => ({
    user: (state.auth && state.auth.currentUser) || null,
  })
)
@graphql(commentListQuery, {
  options: {
    variables: {
      offset: 0,
      limit: COMMENTS_PER_FETCH,
    },
  },
  props: ({ data: { comments, fetchMore } }) => ({
    data: {
      comments,
      loadMoreComments: () => {
        return fetchMore({
          variables: {
            offset: comments.length
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            // previousResult is {} after comment posted ?
            if (!fetchMoreResult.data) {
              return previousResult;
            }
            return {
              comments: [
                ...previousResult.comments,
                ...fetchMoreResult.data.comments
              ],
            };
          },
        });
      }
    }
  }),
})
export default class CommentList extends Component {
  render() {
    const { data: { comments, loadMoreComments }, user } = this.props;
    return (
      <UIComment.Group className={styles.commentList}>
        {user && <NewCommentForm />}
        {comments && comments.map((comment) => (
          <Comment
            comment={comment}
            key={comment.id}
          />
        ))}
        <a className={styles.loadMoreButton} onClick={loadMoreComments}>
          load more...
        </a>
      </UIComment.Group>
    );
  }
}

CommentList.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
    comments: PropTypes.object,
    loadMoreComments: PropTypes.func,
  }),
  user: PropTypes.object,
};
