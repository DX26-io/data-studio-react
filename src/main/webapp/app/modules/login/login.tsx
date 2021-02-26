import React from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Grid, View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { login } from 'app/shared/reducers/authentication';
import { loginWithProvider } from 'app/shared/reducers/authentication';
import LoginForm from './login-form';
import LoginFooter from './login-footer';
import LoginHeader from './login-header';
// TODO create login page image
export interface ILoginProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const Login: React.FC<ILoginProps> = props => {
  const handleLogin = (username, password, rememberMe = false) => {
    props.login(username, password, rememberMe);
  };
  const handleProviderLogin = (provider) => {
    props.loginWithProvider(provider);
  };
  const handleSignup = () => {
    props.history.push('/signup');
  };

  if (props.loginProviderEmailConfirmationToken) {
    return (<Redirect
      to={{
        pathname: '/realm',
      }}
    />);
  }

  if (props.isAuthenticated) {
    return <Redirect
      to={{
        pathname: '/',
        search: props.location.search,
        state: {from: props.location},
      }}
    />;
  }

  return (
    <Grid areas={['image login']} columns={['1fr', '2fr']} rows={['auto']} minHeight={window.innerHeight} data-testid="login-container">
      {/* <Image src="https://i.imgur.com/Z7AzH2c.png" alt="alt-text" objectFit="cover" gridArea="image" />*/}
      <View gridArea="image" backgroundColor="gray-400" />
      <View gridArea="login">
        <LoginHeader />
        <LoginForm handleLogin={handleLogin}
                   loginError={props.loginError}
                   handleProviderLogin={handleProviderLogin}
                   handleSignup={handleSignup}/>
        <LoginFooter />
      </View>
    </Grid>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  isAuthenticated: authentication.isAuthenticated,
  loginError: authentication.loginError,
  loginProviderEmailConfirmationToken: authentication.loginProviderEmailConfirmationToken,
});

const mapDispatchToProps = { login, loginWithProvider };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Login);
