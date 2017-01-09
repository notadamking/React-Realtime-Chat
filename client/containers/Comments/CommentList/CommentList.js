import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { CommentList } from '../../../components';
import { setShouldScrollToBottom } from '../../../redux/actions/comments';
import { commentListQuery, commentFeedSubscription } from './commentList.graphql';

const COMMENTS_PER_FETCH = 10;

function isDuplicateComment(newComment, existingComments) {
  return newComment && existingComments.length > 0
          && existingComments.some(comment => newComment.id === comment.id);
}

@connect(
  (state) => ({
    shouldScrollToBottom: state.comments.shouldScrollToBottom,
    user: state.auth.currentUser,
  })
)
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
    subscribeToMore,
    loadMoreComments: (commentList) => {
      const beforeHeight = commentList.scrollHeight;
      return fetchMore({
        variables: {
          offset: comments.length,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return {
            comments: [...previousResult.comments, ...fetchMoreResult.data.comments],
          };
        },
      }).then(() => {
        const afterHeight = commentList.scrollHeight;
        commentList.scrollTop = afterHeight - beforeHeight;
      });
    },
  }),
})
export default class CommentListContainer extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.subscription && !nextProps.loading) {
      this.subscription = nextProps.subscribeToMore({
        document: commentFeedSubscription,
        updateQuery: (previousResult, { subscriptionData }) => {
          const update = subscriptionData.data.commentFeedUpdated;
          if (update.action === 'add') {
            if (isDuplicateComment(update.comment, previousResult.comments)) {
              return previousResult;
            }

            if (!this.props.user || update.comment.author.id !== this.props.user.id) {
              setTimeout(() => this.props.dispatch(setShouldScrollToBottom()), 50);
            }

            return {
              comments: [update.comment, ...previousResult.comments]
            };
          } else if (update.action === 'delete') {
            const remainingComments = previousResult.comments.filter((comment) => {
              return comment.id !== update.comment.id;
            });

            return {
              comments: remainingComments
            };
          }
        }
      });
    }

    if (nextProps.shouldScrollToBottom) {
      this.commentList.scrollTop = this.commentList.scrollHeight;
      this.props.dispatch(setShouldScrollToBottom(false));
    }
  }

  handleSetRef(ref) {
    this.commentList = ref;
  }

  handleScroll() {
    if (this.commentList.scrollTop === 0) {
      this.props.loadMoreComments(this.commentList);
    }
  }

  render() {
    const { comments } = this.props;
    return (
      <CommentList
        comments={comments}
        onScroll={this.handleScroll.bind(this)}
        onSetRef={this.handleSetRef.bind(this)}
      />
    );
  }
}

CommentListContainer.propTypes = {
  comments: PropTypes.object,
  dispatch: PropTypes.func,
  loadMoreComments: PropTypes.func,
  loading: PropTypes.bool,
  shouldScrollToBottom: PropTypes.bool,
  subscribeToMore: PropTypes.func,
  user: PropTypes.object,
};
