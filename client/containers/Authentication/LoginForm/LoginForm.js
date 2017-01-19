import React, { Component, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import { reduxForm } from 'redux-form';

import { handleLoginSuccess } from '../../../redux/actions/auth';
import { LoginForm } from '../../../components';
import loginMutation from './login.graphql';

@graphql(loginMutation, {
  props: ({ mutate }) => ({
    submitLogin: ({ username, password }) => mutate({ variables: { username, password } }),
  }),
})
@reduxForm({
  form: 'login'
})
export default class LoginFormContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitError: null,
    };
  }

  onSubmit({ username, password }) {
    const { dispatch, submitLogin, onClose } = this.props;
    this.setState({ submitError: null });
    submitLogin({ username, password }).then(({ data: { loginAsUser } }) => {
      dispatch(handleLoginSuccess(loginAsUser));
      onClose();
    }).catch(({ graphQLErrors }) => {
      this.setState({ submitError: graphQLErrors[0].message });
    });
  }

  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    return (
      <LoginForm
        pristine={pristine}
        submitError={this.state.submitError}
        submitting={submitting}
        onSubmit={handleSubmit(this.onSubmit.bind(this))}
      />
    );
  }
}

LoginFormContainer.propTypes = {
  dispatch: PropTypes.func,
  handleSubmit: PropTypes.func,
  pristine: PropTypes.bool,
  submitLogin: PropTypes.func,
  submitting: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
