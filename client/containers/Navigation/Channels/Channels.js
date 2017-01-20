import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { graphql } from 'react-apollo';

import { Channels } from '../../../components';
import { channelsForRoomQuery, channelsInRoomChangedSubscription } from './channels.graphql';

@graphql(channelsForRoomQuery, {
  options: ({ room }) => ({
    variables: { room }
  }),
  props: ({ data: { channelsForRoom, loading, subscribeToMore } }) => ({
    channels: channelsForRoom,
    loading,
    subscribeToMore,
  })
})
export default class ChannelsContainer extends Component {
  componentWillReceiveProps(nextProps) {
    if (!this.subscription && !nextProps.loading) {
      this.subscription = nextProps.subscribeToMore({
        document: channelsInRoomChangedSubscription,
        variables: { room: this.props.room },
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            channelsForRoom: subscriptionData.data.channelsInRoomChanged.channels
          };
        }
      });
    }
  }

  handleClickChannel(channel) {
    const { room } = this.props;
    browserHistory.push(`/${room}/messages/${channel}`);
  }

  render() {
    const { channel, channels } = this.props;
    const channelList = channels.indexOf(channel) === -1 ? [...channels, channel] : channels;
    return (
      <Channels
        activeChannel={channel}
        channels={[...new Set(channelList.filter((c) => c.charAt(0) !== '@'))]}
        onClickChannel={this.handleClickChannel.bind(this)}
      />
    );
  }
}

ChannelsContainer.propTypes = {
  channel: PropTypes.string,
  channels: PropTypes.array,
  room: PropTypes.string,
};
