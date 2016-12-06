import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';

import { CommentList } from '../../../components';
import { commentListQuery, commentsSubscription } from './commentList.graphql';

const COMMENTS_PER_FETCH = 5;

@graphql(commentListQuery, {
  options: {
    variables: {
      offset: 0,
      limit: COMMENTS_PER_FETCH,
    }
  },
  props: ({ data: { comments, fetchMore, loading, subscribeToMore } }) => ({
    comments,
    loading,
    loadMoreComments: () => {
      return fetchMore({
        variables: {
          offset: comments.length,
          limit: COMMENTS_PER_FETCH,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newComments = fetchMoreResult.data.comments;

          if (!previousResult.comments) {
            return newComments;
          }

          return {
            comments: [
              ...previousResult.comments,
              ...newComments,
            ],
          };
        },
      });
    },
    subscribeToMore,
  }),
})
export default class CommentListContainer extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.subscription && !nextProps.loading) {
      this.subscription = nextProps.subscribeToMore({
        document: commentsSubscription,
        updateQuery: (previousResult, { subscriptionData }) => {
          const newComment = subscriptionData.data.commentAdded;

          if (!previousResult.comments) {
            return newComment;
          }

          return {
            comments: [
              newComment,
              ...previousResult.comments,
            ]
          };
        }
      });
    }
  }

  render() {
    const { comments, loadMoreComments } = this.props;
    return (
      <CommentList
        comments={comments}
        onLoadMoreComments={loadMoreComments}
      />
    );
  }
}

CommentListContainer.propTypes = {
  comments: PropTypes.object,
  loadMoreComments: PropTypes.func,
  loading: PropTypes.bool,
  subscribeToMore: PropTypes.func,
};
