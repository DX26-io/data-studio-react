import React from 'react';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import ReportManagement from './reports-management';
import Reports from './reports/reports'

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute exact path={match.url} component={ReportManagement} />
    <ErrorBoundaryRoute exact path={`${match.url}/reports`} component={Reports} />
    <ErrorBoundaryRoute exact path={`${match.url}/task-logger`} component={Reports} />
  </div>
);

export default Routes;