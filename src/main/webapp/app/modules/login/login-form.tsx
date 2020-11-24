import React, { useState } from 'react';
import { Button, Checkbox, Flex, Text, TextField, View, Link, Form } from '@adobe/react-spectrum';
import Alert from '@spectrum-icons/workflow/Alert';
import { Translate } from 'react-jhipster';

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
    <Flex alignItems="center" justifyContent="center" marginX="size-300">
      <Form width="size-4600" isRequired isQuiet onSubmit={handleSubmit} data-testid="login-form">
        <View marginBottom="size-600">
          <span className="spectrum-Heading spectrum-Heading--sizeXXL">
            <Text>
              <Translate contentKey="login.title">Login</Translate>
            </Text>
          </span>
        </View>
        <TextField
          width="100%"
          marginBottom="size-300"
          label="Email Address"
          type="text"
          data-testid="username"
          value={username}
          onChange={setUserName}
        />
        <TextField
          width="100%"
          marginBottom="size-300"
          label="Password"
          type="password"
          data-testid="password"
          value={password}
          onChange={setPassword}
        />
        {loginError && !emptyFieldError && (
          <Flex gap="size-100">
            <Alert color="negative" />
            <Text marginBottom="size-300">
              <span className="spectrum-Body-emphasis error-message" data-testid="login-error">
                <Translate contentKey="login.messages.error.authentication">Your username or password does not match any account</Translate>
              </span>
            </Text>
          </Flex>
        )}
        {emptyFieldError && (
          <Flex gap="size-100">
            <Alert color="negative" />
            <Text marginBottom="size-300">
              <span className="spectrum-Body-emphasis error-message" data-testid="empty-error">
                <Translate contentKey="login.messages.error.emptyUsernameOrPassword"> Username or password should not be empty</Translate>
              </span>
            </Text>
          </Flex>
        )}
        <Checkbox marginTop="static-size-25" isRequired={false} isSelected={rememberMe} onChange={setRememberMe} data-testid="remember-me">
          <Translate contentKey="login.form.rememberMe">Remember me</Translate>
        </Checkbox>
        <Flex data-testid="login-action" marginTop="size-400" alignItems="center" justifyContent="center" direction="row-reverse">
          <Button data-testid="submit" variant="cta" marginStart="auto" type="submit">
            <Translate contentKey="login.form.button">Sign In</Translate>
          </Button>
          <Link isQuiet={true}>
            <a href="/">
              <Translate contentKey="login.form.sso">Use Single Sign On (SSO)</Translate>
            </a>
          </Link>
        </Flex>
      </Form>
    </Flex>
  );
};

export default LoginForm;
