import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Datasources from './datasources';
import DatasourcesDetail from './datasources-detail';
import DatasourcesUpdate from './datasources-update';
import DatasourcesDeleteDialog from './datasources-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={DatasourcesUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={DatasourcesUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={DatasourcesDetail} />
      <ErrorBoundaryRoute path={match.url} component={Datasources} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={DatasourcesDeleteDialog} />
  </>
);

export default Routes;
