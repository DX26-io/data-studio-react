import React from 'react';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import ReportsConfiguration from '../report-management/reports-configuration/reports-configuration';
import ReportManagement from './report-management';


const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute exact path={match.url} component={ReportManagement} />
    <ErrorBoundaryRoute exact path={`${match.url}/reports-configuration`} component={ReportsConfiguration} />
  </div>
);

export default Routes;
