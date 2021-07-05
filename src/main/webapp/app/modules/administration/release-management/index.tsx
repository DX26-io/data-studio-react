import React from 'react';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import ReportsConfiguration from '../reports-configuration/reports-configuration';
import Teams from '../reports-configuration/teams/teams';

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute exact path={match.url} component={ReportsConfiguration} />
    {/* <ErrorBoundaryRoute exact path={`${match.url}/teams`} component={Teams} /> */}
  </div>
);

export default Routes;