import React, { PropTypes } from 'react';
import { Form, Label } from 'semantic-ui-react';

const FormTextField = ({ input, label, placeholder, rows, meta: { touched, error } }) => (
  <div>
    <Form.TextArea
      {...input}
      error={touched && Boolean(error)}
      label={label}
      placeholder={placeholder}
      rows={rows}
    />
    {touched && error && <Label basic color='red' content={error} pointing />}
  </div>
);

FormTextField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool.isRequired,
    error: PropTypes.string,
  }).isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
};

export default FormTextField;
