import React from 'react';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Releases from '../release-management/releases';

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute exact path={match.url} component={Releases} />
  </div>
);

export default Routes;
