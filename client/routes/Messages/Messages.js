import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';

import { MessageList, NewMessageForm } from '../../containers';

const Messages = ({ params, route }) => {
  const room = (params.room || route.room);
  const channel = (params.channel || route.channel);
  return (
    <div>
      <Helmet
        title={`${room.charAt(0).toUpperCase() + room.slice(1)} - ${channel} messages`}
      />
      <MessageList channel={channel} room={room} />
      <NewMessageForm channel={channel} room={room} />
    </div>
  );
};

Messages.propTypes = {
  params: PropTypes.shape({
    channel: PropTypes.string,
    room: PropTypes.string,
  }),
  route: PropTypes.shape({
    channel: PropTypes.string,
    room: PropTypes.string,
  }),
};

export default Messages;
