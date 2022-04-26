import React from 'react';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Canvas from './canvas';

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute path={`${match.url}/dashboard/:dashboardId/views/:viewId/build`} component={Canvas} />
  </div>
);

export default Routes;
