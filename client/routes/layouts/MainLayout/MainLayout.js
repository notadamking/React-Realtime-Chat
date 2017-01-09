import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { graphql } from 'react-apollo';
import Helmet from 'react-helmet';

import config from '../../../../config';
import { setLoggedIn, setLoggedOut } from '../../../redux/actions/auth';
import { Navbar } from '../../../containers';
import getCurrentUser from './currentUser.graphql';
import styles from './MainLayout.css';

@connect()
@graphql(getCurrentUser, { options: { ssr: false } })
export default class MainLayout extends Component {
  componentWillReceiveProps({ data: { currentUser }, user }) {
    const { dispatch } = this.props;
    if (currentUser) {
      if (user !== currentUser) {
        dispatch(setLoggedIn(currentUser));
      }
    } else if (this.props.user) {
      dispatch(setLoggedOut());
    }
  }

  render() {
    const { children } = this.props;
    return (
      <div className={styles.page}>
        <Helmet title=' ' titleTemplate={`%s | ${config.meta.title}`} />
        <Navbar />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    );
  }
}

MainLayout.propTypes = {
  children: PropTypes.object.isRequired,
  data: PropTypes.shape({
    currentUser: PropTypes.object,
  }),
  dispatch: PropTypes.func,
  user: PropTypes.object,
};
