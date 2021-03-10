import React, { useLayoutEffect } from 'react';
import { connect } from 'react-redux';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import { IRootState } from 'app/shared/reducers';
import { logout } from 'app/shared/reducers/authentication';
import { View, Flex, Link, Button } from '@adobe/react-spectrum';
import Logo from 'app/shared/components/logo/logo';
import { Translate } from 'react-jhipster';

export interface ILogoutProps extends StateProps, DispatchProps {
  idToken: string;
  logoutUrl: string;
}

export const Logout = (props: ILogoutProps) => {
  const history = useHistory();
  useLayoutEffect(() => {
    props.logout();
    const logoutUrl = props.logoutUrl;
    if (logoutUrl) {
      // if Keycloak, logoutUrl has protocol/openid-connect in it
      window.location.href = logoutUrl.includes('/protocol')
        ? logoutUrl + '?redirect_uri=' + window.location.origin
        : logoutUrl + '?id_token_hint=' + props.idToken + '&post_logout_redirect_uri=' + window.location.origin;
    }
  });

  const handleNavigateToLogin = () => {
    history.push('/signin');
  };

  return (
    <Flex justifyContent="center" alignItems="center" minHeight={window.innerHeight}>
      <View borderWidth="thin" borderColor="dark" borderRadius="medium" backgroundColor="gray-50" paddingY="size-600" paddingX="size-1200">
        <Flex direction="column" gap="size-200" justifyContent="center" alignItems="center">
          <Logo />
          <span className="spectrum-Body--sizeS">
            <strong>Logged out successfully!</strong>
          </span>
          <Button variant="cta" onPress={handleNavigateToLogin}>
            <Translate contentKey="logout.loginText">Click here to login</Translate>
          </Button>
        </Flex>
      </View>
    </Flex>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  logoutUrl: storeState.authentication.logoutUrl,
  idToken: storeState.authentication.idToken,
});

const mapDispatchToProps = { logout };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
