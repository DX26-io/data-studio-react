import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Grid, View } from '@adobe/react-spectrum';
import { IRootState } from '../../shared/reducers';
import { login, getSession } from '../../shared/reducers/authentication';
import LoginForm from './login-form';
import LoginFooter from './login-footer';
import LoginTopText from './login-top-text';
import './login.scss';

export interface ILoginProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const Login = (props: ILoginProps) => {
  const handleLogin = (username, password, rememberMe = false) => {
    props.login(username, password, rememberMe);
  };

  return (
    <Grid areas={['todo login']} columns={['2fr', '2fr']} rows={['auto']} minHeight={window.innerHeight} data-testid="login-container">
      <View backgroundColor="blue-600" gridArea="todo" overflow="hidden" />
      <View gridArea="login" backgroundColor="static-white">
        <LoginTopText />
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

const mapDispatchToProps = { login, getSession };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Login);
