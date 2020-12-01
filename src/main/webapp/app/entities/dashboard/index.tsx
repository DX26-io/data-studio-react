import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Dashboard from './dashboard';
import Views from '../views/views';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={Views} />
      <ErrorBoundaryRoute path={match.url} component={Dashboard} />
    </Switch>
  </>
);

export default Routes;
