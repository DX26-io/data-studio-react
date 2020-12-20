import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Views from './views';
import ViewCreateModal from './view-create-modal';
import ViewDeleteModal from './view-delete-modal';
import ViewPropertiesModal from './view-properties-modal';
const Routes = ({ match }) => (
  <>
    <Switch>
      {/* display all views */}
      {/* <ErrorBoundaryRoute path={match.url} component={Views} /> */}
      {/* <ErrorBoundaryRoute exact path={`${match.url}/:id/:viewId/properties`} component={ViewPropertiesModal} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/:viewId/delete`} component={ViewDeleteModal} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/create`} component={ViewCreateModal} /> */}
    </Switch>
  </>
);

export default Routes;
