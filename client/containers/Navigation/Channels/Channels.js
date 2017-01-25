import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { graphql } from 'react-apollo';

import { Channels, NewChannelModal } from '../../../components';
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
  constructor(props) {
    super(props);

    this.state = {
      isCreatingNewChannel: false
    };
  }

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

  handleClickCreateNewChannel() {
    this.setState({ isCreatingNewChannel: true });
  }

  handleCloseModal() {
    this.setState({ isCreatingNewChannel: false });
  }

  handleKeyUp(e) {
    if (e.which === 13) {
      const { room } = this.props;
      this.setState({ isCreatingNewChannel: false });
      if (e.target.value) {
        browserHistory.push(`/${room}/messages/${e.target.value}`);
      }
    }
  }

  render() {
    const { channel, channels } = this.props;
    const channelList = channels.indexOf(channel) === -1 ? [...channels, channel] : channels;
    return (
      <div>
        <Channels
          activeChannel={channel}
          channels={[...new Set(channelList.filter((c) => c.charAt(0) !== '@'))]}
          onClickChannel={this.handleClickChannel.bind(this)}
          onClickCreateNewChannel={this.handleClickCreateNewChannel.bind(this)}
        />
        <NewChannelModal
          open={this.state.isCreatingNewChannel}
          onClose={this.handleCloseModal.bind(this)}
          onKeyUp={this.handleKeyUp.bind(this)}
        />
      </div>
    );
  }
}

ChannelsContainer.propTypes = {
  channel: PropTypes.string,
  channels: PropTypes.array,
  room: PropTypes.string,
};
