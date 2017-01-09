import React, { PropTypes } from 'react';
import { Form, Label } from 'semantic-ui-react';

const FormTextField = ({ autoHeight, input, label, placeholder, rows, meta: { touched, error }, onKeyPress }) => (
  <div>
    <Form.TextArea
      {...input}
      autoHeight={autoHeight}
      error={touched && Boolean(error)}
      label={label}
      placeholder={placeholder}
      rows={rows}
      onKeyPress={onKeyPress}
    />
    {touched && error && <Label basic color='red' content={error} pointing />}
  </div>
);

FormTextField.propTypes = {
  autoHeight: PropTypes.bool,
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool.isRequired,
    error: PropTypes.string,
  }).isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  onKeyPress: PropTypes.func,
};

export default FormTextField;
