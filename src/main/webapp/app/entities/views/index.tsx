import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Views from './views';
import ViewsDetail from './views-detail';
import ViewsUpdate from './views-update';
import ViewsDeleteDialog from './views-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ViewsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ViewsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ViewsDetail} />
      <ErrorBoundaryRoute path={match.url} component={Views} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ViewsDeleteDialog} />
  </>
);

export default Routes;
