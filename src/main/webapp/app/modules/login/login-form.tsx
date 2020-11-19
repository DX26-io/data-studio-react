import React, { useState } from 'react';
import { Button, Checkbox, Flex, Text, TextField, View } from '@adobe/react-spectrum';
import Alert from '@spectrum-icons/workflow/Alert';

export interface ILoginProps {
  loginError: boolean;
  handleLogin: (username: string, password: string, rememberMe: boolean) => void;
}
export const LoginForm = (props: ILoginProps) => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emptyFieldError, setEmptyFieldError] = useState(false);
  const { handleLogin } = props;
  const { loginError } = props;

  const handleSubmit = event => {
    event.preventDefault();
    if (username && password) {
      setEmptyFieldError(false);
      handleLogin(username, password, rememberMe);
    } else {
      setEmptyFieldError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form" data-testid="login-form">
      <View marginBottom="size-600">
        <span className="spectrum-Heading spectrum-Heading--sizeXXL">
          <Text>Login</Text>
        </span>
      </View>
      <TextField
        width="100%"
        marginBottom="size-300"
        label="Email Address"
        isQuiet
        isRequired
        type="text"
        data-testid="username"
        value={username}
        onChange={setUserName}
      />
      <TextField
        width="100%"
        marginBottom="size-300"
        label="Password"
        isQuiet
        isRequired
        type="password"
        data-testid="password"
        value={password}
        onChange={setPassword}
      />

      {loginError && !emptyFieldError && (
        <Flex gap="size-100">
          <Alert color="negative" />
          <Text marginBottom="size-300">
            <span className="spectrum-Body-emphasis error-message">Your username or password does not match any account</span>
          </Text>
        </Flex>
      )}

      {emptyFieldError && (
        <Flex gap="size-100">
          <Alert color="negative" />
          <Text marginBottom="size-300">
            <span className="spectrum-Body-emphasis error-message">Your username or password should not be empty</span>
          </Text>
        </Flex>
      )}
      <Checkbox marginTop="static-size-25" isSelected={rememberMe} onChange={setRememberMe} data-testid="rememberme">
        Remember me
      </Checkbox>
      <Flex data-testid="login-action" marginTop="size-400" alignItems="center" justifyContent="center">
        <Text>
          Sign In using&nbsp;
          <a href="/" className="dx26-link">
            SSO
          </a>
        </Text>
        <Button data-testid="submit" variant="cta" marginStart="auto" type="submit">
          Sign In
        </Button>
      </Flex>
    </form>
  );
};

export default LoginForm;
