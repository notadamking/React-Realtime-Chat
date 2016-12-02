import React, { PropTypes } from 'react';
import { Comment } from 'semantic-ui-react';

import { RelativeTime } from '../../';

const CommentComponent = ({ comment }) => (
  <Comment>
    <Comment.Avatar src={`https://api.adorable.io/avatars/64/${comment.author.email}.png`} />
    <Comment.Content>
      <Comment.Author as='a'>{comment.author.email}</Comment.Author>
      <Comment.Metadata>
        <RelativeTime time={comment.createdAt} />
      </Comment.Metadata>
      <Comment.Text>{comment.content}</Comment.Text>
      <Comment.Actions>
        <Comment.Action>Reply</Comment.Action>
      </Comment.Actions>
    </Comment.Content>
  </Comment>
);

CommentComponent.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default CommentComponent;
