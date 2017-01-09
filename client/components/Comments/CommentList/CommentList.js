import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

import { Comment, NewCommentForm } from '../../../containers';
import styles from './CommentList.css';

export default class CommentList extends Component {
  render () {
    const { comments, onScroll, onSetRef } = this.props;
    return (
      <div className={styles.commentsContainer}>
        <div
          className={cx('ui', 'comments', styles.commentList)}
          ref={onSetRef}
          onScroll={onScroll}
        >
          {comments && comments.reverse().map((comment) => comment && (
            <Comment
              comment={comment}
              key={comment.id}
            />
          ))}
        </div>
        <NewCommentForm />
      </div>
    );
  }
}

CommentList.propTypes = {
  comments: PropTypes.array,
  onScroll: PropTypes.func,
  onSetRef: PropTypes.func,
};
