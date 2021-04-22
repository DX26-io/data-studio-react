import React from 'react';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import ReportsConfiguration from '../report-management/reports-configuration/reports-configuration';
import ReportManagement from './report-management';
import Teams from '../report-management/reports-configuration/teams/teams';

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute exact path={match.url} component={ReportManagement} />
    <ErrorBoundaryRoute exact path={`${match.url}/reports-configuration`} component={ReportsConfiguration} />
    <ErrorBoundaryRoute exact path={`${match.url}/reports-configuration/teams`} component={Teams} />
  </div>
);

export default Routes;