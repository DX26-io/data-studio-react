import React, { useState } from 'react';
import { Button, Checkbox, Flex, Text, TextField, View, Link, Form } from '@adobe/react-spectrum';
import Alert from '@spectrum-icons/workflow/Alert';
import { Translate } from 'react-jhipster';
import config from "app/config/constants";

export interface ISignupProps {
  signupError: boolean;
  handleSignup: (username: string, email: string, password: string, firstname: string, lastname: string) => void;
  handleProviderLogin: (provider: string) => void;
}
export const SignupForm = (props: ISignupProps) => {
  const firebaseEnabled = config.CLOUD;
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emptyFieldError, setEmptyFieldError] = useState(false);
  const { handleSignup, handleProviderLogin, signupError } = props;

  const onGoogleClick = () => {
    handleProviderLogin('google');
  }

  const handleSubmit = event => {
    event.preventDefault();
    if (email && password && username && firstname && lastname) {
      setEmptyFieldError(false);
      handleSignup(username, email, password, firstname, lastname);
    } else {
      setEmptyFieldError(true);
    }
  };

  return (
    <Flex alignItems="center" justifyContent="center" marginX="size-300">
      <Form width="size-4600" isRequired isQuiet onSubmit={handleSubmit} data-testid="signup-form">
        <View marginBottom="size-600">
          <span className="spectrum-Heading spectrum-Heading--sizeXXL">
            <Text>
              <Translate contentKey="signup.title">Signup</Translate>
            </Text>
          </span>
        </View>
        <TextField
          width="100%"
          marginBottom="size-300"
          label="First name"
          type="text"
          data-testid="firstname"
          value={firstname}
          onChange={setFirstname}
        />
        <TextField
          width="100%"
          marginBottom="size-300"
          label="Last name"
          type="text"
          data-testid="lastname"
          value={lastname}
          onChange={setLastname}
        />
        <TextField
          width="100%"
          marginBottom="size-300"
          label="Username"
          type="text"
          data-testid="username"
          value={username}
          onChange={setUsername}
        />
        <TextField
          width="100%"
          marginBottom="size-300"
          label="Email"
          type="email"
          data-testid="email"
          value={email}
          onChange={setEmail}
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
        {signupError && !emptyFieldError && (
          <Flex gap="size-100" data-testid="signup-error">
            <Alert color="negative" />
            <Text marginBottom="size-300">
              <span className="spectrum-Body-emphasis error-message">
                <Translate contentKey="signup.messages.error.authentication">Your username or password does not match any account</Translate>
              </span>
            </Text>
          </Flex>
        )}
        {emptyFieldError && (
          <Flex gap="size-100" data-testid="empty-error">
            <Alert color="negative" />
            <Text marginBottom="size-300">
              <span className="spectrum-Body-emphasis error-message">
                <Translate contentKey="signup.messages.error.emptyFields"> Username or password should not be empty</Translate>
              </span>
            </Text>
          </Flex>
        )}
        <Flex data-testid="signup-action" marginTop="size-400" alignItems="center" justifyContent="center" direction="row-reverse">
          <Button data-testid="submit" variant="cta" marginStart="auto" type="submit">
            <Translate contentKey="signup.form.button">Sign In</Translate>
          </Button>
          {firebaseEnabled ?
            <Button data-testid="submit" variant="secondary" marginStart="auto" type="button" onPress={onGoogleClick}>
              <Translate contentKey="signup.form.google">Google</Translate>
            </Button>
            :
            null}
        </Flex>
      </Form>
    </Flex>
  );
};

export default SignupForm;
