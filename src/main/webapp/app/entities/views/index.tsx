import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Views from './views';
import { Home } from 'app/modules/home/home';

const Routes = ({ match }) => (
  <>
    <Switch>
      {/* display all views */}
      {/* <ErrorBoundaryRoute path={match.url/dashboards/:dashboardId/views/:viewId`} component={Views} /> */}
      <ErrorBoundaryRoute path={`${match.url}/:id`} component={Home} />
    </Switch>
  </>
);

export default Routes;
