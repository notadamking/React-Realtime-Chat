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

  async onSubmit({ username, password }) {
    const { dispatch, submitLogin, onClose } = this.props;
    this.setState({ submitError: null });
    const { data: { loginAsUser } } = await submitLogin({ username, password });
    if (loginAsUser.error) {
      this.setState({ submitError: loginAsUser.error });
    } else {
      dispatch(handleLoginSuccess(loginAsUser));
      onClose();
    }
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
