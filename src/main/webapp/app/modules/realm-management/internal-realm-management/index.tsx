import React from 'react';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Realms from './realms';

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute path={`${match.url}`} component={Realms} />
  </div>
);

export default Routes;
