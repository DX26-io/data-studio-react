import React from 'react';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Settings from './settings/settings';
import Password from './password/password';
import Account from "./account";

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute exact path={`${match.url}/settings`} component={Settings} />
    <ErrorBoundaryRoute exact path={`${match.url}/password`} component={Password} />
    <ErrorBoundaryRoute exact path={`${match.url}`} component={Account} />
  </div>
);

export default Routes;
