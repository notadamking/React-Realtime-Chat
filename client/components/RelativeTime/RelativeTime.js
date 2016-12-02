import React, { PropTypes } from 'react';
import moment from 'moment';

const RelativeTime = ({ time, text }) => {
  return <time>{text}{moment(new Date(time)).fromNow()}</time>;
};

RelativeTime.propTypes = {
  text: PropTypes.string,
  time: PropTypes.string.isRequired,
};

export default RelativeTime;
