import React, { PropTypes } from 'react';
import { Modal } from 'semantic-ui-react';

import { LoginForm } from '../../../containers';
import styles from './LoginModal.css';

const LoginModal = ({ open, onShowSignupModal }) => (
  <Modal dimmer open={open} size='small'>
    <Modal.Header>Login</Modal.Header>
    <Modal.Content>
      <LoginForm />
    </Modal.Content>
    <a className={styles.signupLink} onClick={onShowSignupModal} >
      Need an account?&nbsp; Sign up, it's free!
    </a>
  </Modal>
);

LoginModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onShowSignupModal: PropTypes.func.isRequired,
};

export default LoginModal;
