import React, { useState } from 'react';
import { TextField, Flex, Checkbox, Button, Text } from '@adobe/react-spectrum';
import Typography from '@material-ui/core/Typography';

export interface ILoginProps {
  loginError: boolean;
  handleLogin: (username: string, password: string, rememberMe: boolean) => void;
}

export const LoginForm = (props: ILoginProps) => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    const { handleLogin } = props;
    handleLogin(username, password, rememberMe);
  };

  const { loginError } = props;

  return (
    <form onSubmit={handleSubmit} className="login-form" data-testid="login-form">
      <Typography className="dx26-font-bold" variant="h4">
        Login
      </Typography>
      <br />
      <TextField  width="100%" marginTop="static-size-25" label="Email Address" isQuiet isRequired type="text" data-testid="username" value={username} onChange={setUserName} />
      <TextField  width="100%" marginTop="static-size-25" label="Password" isQuiet isRequired type="password" data-testid="password" value={password} onChange={setPassword} />
      <Checkbox marginTop="static-size-25" isSelected={rememberMe} onChange={setRememberMe} data-testid="rememberme">
        Remember me
      </Checkbox>
      <Flex data-testid="login-action" marginTop="static-size-200" direction="row" alignItems="center" justifyContent="center">
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
