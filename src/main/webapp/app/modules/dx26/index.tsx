import React from 'react';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Dx26 from './dx26';

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute path={`${match.url}/dashboard/:dashboardId/views/:viewId/build`} component={Dx26} />
  </div>
);

export default Routes;
