import React from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Grid, View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import {loginWithProvider, signup} from "app/shared/reducers/authentication";
import SignupHeader from "app/modules/signup/signup-header";
import SignupForm from "app/modules/signup/signup-form";
import SignupFooter from "app/modules/signup/signup-footer";

export interface ISignupProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const Signup: React.FC<ISignupProps> = props => {
  const handleSignup = (username: string, email: string, password: string, firstname: string, lastname: string) => {
    props.signup(username, email, password, firstname, lastname);
  };
  const handleProviderLogin = (provider) => {
    props.loginWithProvider(provider);
  };

  return !props.isAuthenticated ? (
    <Grid areas={['image login']} columns={['1fr', '2fr']} rows={['auto']} minHeight={window.innerHeight} data-testid="login-container">
      {/* <Image src="https://i.imgur.com/Z7AzH2c.png" alt="alt-text" objectFit="cover" gridArea="image" />*/}
      <View gridArea="image" backgroundColor="gray-400" />
      <View gridArea="login">
        <SignupHeader />
        <SignupForm handleSignup={handleSignup} signupError={props.signupError}  handleProviderLogin={handleProviderLogin}/>
        <SignupFooter />
      </View>
    </Grid>
  ) : (
    <Redirect
      to={{
        pathname: '/',
        search: props.location.search,
        state: { from: props.location },
      }}
    />
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  isAuthenticated: authentication.isAuthenticated,
  signupError: authentication.signupError,
});

const mapDispatchToProps = { signup, loginWithProvider };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
