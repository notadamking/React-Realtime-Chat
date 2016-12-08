import React, { PropTypes } from 'react';
import { Comment, Icon } from 'semantic-ui-react';
import cx from 'classnames';

import { RelativeTime } from '../../';
import styles from './Comment.css';

const CommentComponent = ({ comment, isRemovable, onDelete }) => (
  <Comment className={cx({ [styles.newComment]: comment.id !== '0' })}>
    <Comment.Avatar src={`https://api.adorable.io/avatars/64/${comment.author.email}.png`} />
    <Comment.Content>
      <Comment.Author as='a'>{comment.author.email}</Comment.Author>
      <Comment.Metadata>
        <RelativeTime time={comment.createdAt} />
      </Comment.Metadata>
      <Comment.Text>{comment.content}</Comment.Text>
      <Comment.Actions>
        <Comment.Action>
          <Icon name='reply' /> Reply
        </Comment.Action>
        {isRemovable && (
          <Comment.Action onClick={onDelete}>
            <Icon name='trash' /> Delete
          </Comment.Action>
        )}
      </Comment.Actions>
    </Comment.Content>
  </Comment>
);

CommentComponent.propTypes = {
  comment: PropTypes.object.isRequired,
  isRemovable: PropTypes.bool,
  onDelete: PropTypes.func.isRequired,
};

export default CommentComponent;
