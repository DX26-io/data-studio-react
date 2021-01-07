import React from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { Grid, View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import {loginWithProvider, signup} from "app/shared/reducers/authentication";
import LoginHeader from "app/modules/login/login-header";
import LoginFooter from "app/modules/login/login-footer";
import RealmForm from "app/modules/signup/realm/realm-form";

export interface IRealmProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

const Realm: React.FC<IRealmProps> = props => {
  const handleCreate = (realmName: string) => {
    // props.signup(realmName);
  };

  return (
    <Grid areas={['image login']} columns={['1fr', '2fr']} rows={['auto']} minHeight={window.innerHeight} data-testid="realm-create-container">
      <View gridArea="image" backgroundColor="gray-400" />
      <View gridArea="login">
        <LoginHeader />
        <RealmForm handleCreate={handleCreate} realmCreateError={props.realmCreateError} />
        <LoginFooter />
      </View>
    </Grid>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  realmCreateError: authentication.realmCreateError,
});

const mapDispatchToProps = { signup };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Realm);
