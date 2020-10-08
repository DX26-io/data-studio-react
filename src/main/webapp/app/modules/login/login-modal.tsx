import React from 'react';
import { Provider, defaultTheme, Form, TextField, Checkbox, Button } from '@adobe/react-spectrum';

export interface ILoginModalProps {
  showModal: boolean;
  loginError: boolean;
  handleLogin: Function;
  handleClose: Function;
}

class LoginModal extends React.Component<ILoginModalProps> {
  handleSubmit = (event, errors, { username, password, rememberMe }) => {
    const { handleLogin } = this.props;
    handleLogin(username, password, rememberMe);
  };

  render() {
    return (
      <Provider theme={defaultTheme}>
        <Form maxWidth="size-3600">
          <TextField label="Email" isRequired placeholder="Email Addess" />
          <TextField label="Password" isRequired type="password" placeholder="Password" />
          <Checkbox>Remember me</Checkbox>
          <Button maxWidth="size-200" variant="cta">Login</Button>
        </Form>
      </Provider>
    );
  }
}

export default LoginModal;
