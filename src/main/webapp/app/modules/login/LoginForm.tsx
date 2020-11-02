import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Flex, Form, Checkbox, Button, Text } from '@adobe/react-spectrum';
import Typography from '@material-ui/core/Typography';

export interface ILoginProps {
  loginError: boolean;
  handleLogin: (username: string,password: string, rememberMe: boolean) => void;
}

export const LoginForm = (props: ILoginProps) => {

  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const { handleLogin } = props;
    handleLogin(username, password, rememberMe);
  };

  const { loginError } = props;

  return (
    <Form onSubmit={handleSubmit} aria-label="Login Form" width="50%" margin="auto" marginTop="33%">
      <Typography className="dx26-font-bold" variant="h4">Login</Typography>
      <br />
      <TextField label="Email Address" isQuiet isRequired type="text" value={username} onChange={setUserName} />
      <TextField label="Password" isQuiet isRequired type="password" value={password} onChange={setPassword} />
      <Checkbox isSelected={rememberMe} onChange={setRememberMe}>Remember me</Checkbox>
      <br />
      <Flex direction="row" alignItems="center" justifyContent="center">
        <Text>Sign In using&nbsp;
        <Link to="/" className="dx26-link">
            SSO
        </Link>
        </Text>
        <Button variant="cta" marginStart="auto" type="submit">Sign In</Button>
      </Flex>
    </Form>
  );
};

export default LoginForm;
