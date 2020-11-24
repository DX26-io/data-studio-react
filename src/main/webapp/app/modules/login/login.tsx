import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Grid, View } from '@adobe/react-spectrum';
import { IRootState } from '../../shared/reducers';
import { login } from '../../shared/reducers/authentication';
import LoginForm from './login-form';
import LoginFooter from './login-footer';
import LoginHeader from './login-header';
// TODO create login page image
export interface ILoginProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const Login: React.FC<ILoginProps> = props => {
  const handleLogin = (username, password, rememberMe = false) => {
    props.login(username, password, rememberMe);
  };

  return (
    <Grid areas={['image login']} columns={['1fr', '2fr']} rows={['auto']} minHeight={window.innerHeight} data-testid="login-container">
      {/* <Image src="https://i.imgur.com/Z7AzH2c.png" alt="alt-text" objectFit="cover" gridArea="image" />*/}
      <View gridArea="image" backgroundColor="gray-400"></View>
      <View gridArea="login">
        <LoginHeader />
        <LoginForm handleLogin={handleLogin} loginError={props.loginError} />
        <LoginFooter />
      </View>
    </Grid>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  isAuthenticated: authentication.isAuthenticated,
  loginError: authentication.loginError,
});

const mapDispatchToProps = { login };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Login);
