import React, { PropTypes } from 'react';
import { Comment as UIComment } from 'semantic-ui-react';

import { Comment, NewCommentForm } from '../../../containers';
import styles from './CommentList.css';

const CommentList = ({ comments, refetchComments, onLoadMoreComments }) => (
  <UIComment.Group className={styles.commentList}>
    <NewCommentForm
      refetch={() => refetchComments({
        offset: 0,
        limit: comments && comments.length,
      })}
    />
    {comments && comments.map((comment) => comment && (
      <Comment
        comment={comment}
        key={comment.id}
      />
    ))}
    <a className={styles.loadMoreButton} onClick={onLoadMoreComments}>
      load more...
    </a>
  </UIComment.Group>
);

CommentList.propTypes = {
  comments: PropTypes.array,
  refetchComments: PropTypes.func,
  onLoadMoreComments: PropTypes.func,
};

export default CommentList;
