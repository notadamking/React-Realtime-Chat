import React, { Component, PropTypes } from 'react';
import moment from 'moment';

export default class RelativeTime extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeFromNow: null,
    };
  }

  componentDidMount() {
    this.setTimeFromNow();
  }

  setTimeFromNow() {
    const { time } = this.props;
    this.setState({
      timeFromNow: moment(new Date(time)).fromNow(),
    });
  }

  render() {
    if (!this.state.timeFromNow) return null;

    const { text } = this.props;
    return <time>{text}{this.state.timeFromNow}</time>;
  }
}

RelativeTime.propTypes = {
  text: PropTypes.string,
  time: PropTypes.string.isRequired,
};
