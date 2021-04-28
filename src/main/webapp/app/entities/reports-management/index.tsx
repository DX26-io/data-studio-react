import React from 'react';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import ReportManagement from './reports-management';

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute exact path={match.url} component={ReportManagement} />
    {/* TODO */}
    {/* <ErrorBoundaryRoute exact path={`${match.url}/reports`} component={} />
    <ErrorBoundaryRoute exact path={`${match.url}/task-logger`} component={} /> */}
  </div>
);

export default Routes;