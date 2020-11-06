import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Dashboard from './dashboard';
import DashboardDetail from './dashboard-detail';
import DashboardUpdate from './dashboard-update';
import DashboardDeleteDialog from './dashboard-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={DashboardUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={DashboardUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={DashboardDetail} />
      <ErrorBoundaryRoute path={match.url} component={Dashboard} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={DashboardDeleteDialog} />
  </>
);

export default Routes;
