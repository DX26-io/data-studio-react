import React from 'react';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Connections from './connections/connections';
import Datasources from './datasources/datasources';
import Sources from './sources';


const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute exact path={match.url} component={Sources} />
    <ErrorBoundaryRoute exact path={`${match.url}/connections`} component={Connections} />
    <ErrorBoundaryRoute exact path={`${match.url}/datasources`} component={Datasources} />
  </div>
);

export default Routes;
