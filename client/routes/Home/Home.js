import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import Helmet from 'react-helmet';

import { setCurrentUser, removeCurrentUser } from '../../redux/actions';
import getCurrentUser from './currentUser.graphql';

@graphql(getCurrentUser, { skip: __SERVER__, options: { forceFetch: __CLIENT__ } })
@connect(
  (state) => ({
    user: (state.auth && state.auth.currentUser) || null,
  }),
  (dispatch) => ({
    setCurrentUser: (user) => {
      dispatch(setCurrentUser(user));
    },
    removeCurrentUser: () => {
      dispatch(removeCurrentUser());
    }
  })
)
export default class Home extends Component {
  componentWillReceiveProps({ data: { currentUser }, user }) {
    if (currentUser && currentUser.user) {
      if (user !== currentUser.user) {
        this.props.setCurrentUser(currentUser.user);
      }
    } else if (this.props.user) {
      this.props.removeCurrentUser();
    }
  }

  render() {
    const { user, children } = this.props;
    return (
      <div>
        <Helmet title='Home' />
        <h1>Welcome {user && user.email}</h1>
        {children}
      </div>
    );
  }
}

Home.propTypes = {
  children: PropTypes.object,
  data: PropTypes.shape({
    currentUser: PropTypes.object,
    loading: PropTypes.bool.isRequired,
  }),
  removeCurrentUser: PropTypes.func,
  setCurrentUser: PropTypes.func,
  user: PropTypes.object,
};
