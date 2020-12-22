import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Visualizations from './visualizations';
import VisualizationsDetail from './visualizations-detail';
import VisualizationsUpdate from './visualizations-update';
import VisualizationsDeleteDialog from './visualizations-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={VisualizationsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={VisualizationsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={VisualizationsDetail} />
      <ErrorBoundaryRoute path={match.url} component={Visualizations} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={VisualizationsDeleteDialog} />
  </>
);

export default Routes;
