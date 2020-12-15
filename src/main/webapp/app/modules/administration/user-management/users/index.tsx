import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Users from './users';

const Routes = ({ match }) => (
  <div>
    <Switch>
    <ErrorBoundaryRoute path={match.url} component={Users} />
    </Switch>
  </div>
);


export default Routes;
