import React from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Grid, View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import {loginWithProvider, signup} from "app/shared/reducers/authentication";
import SignupForm from "app/modules/signup/signup-form";
import LoginFooter from "app/modules/login/login-footer";
import LoginHeader from "app/modules/login/login-header";
import SignupDoneForm from "app/modules/signup/signup-done-form";

export interface ISignupProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

const Signup: React.FC<ISignupProps> = props => {
  const handleSignup = (username: string, email: string, password: string, firstname: string, lastname: string) => {
    props.signup(username, email, password, firstname, lastname);
  };

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
        {
          props.signupSuccess
            ?
            <SignupDoneForm />
            :
            <SignupForm
              handleSignup={handleSignup}
              signupError={props.signupError}/>
        }
        <LoginFooter/>
      </View>
    </Grid>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  isAuthenticated: authentication.isAuthenticated,
  signupSuccess: authentication.signupSuccess,
  signupError: authentication.signupError,
});

const mapDispatchToProps = { signup };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
