import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Dashboard from './dashboard';
import DashboardCreateModal from './dashboard-create-modal';
import DashboardDeleteModal from './dashboard-delete-modal';
import DashboardPropertiesModal from './dashboard-properties-modal';

import Views from '../views/views';
import ViewCreateModal from '../views/view-create-modal';
import ViewDeleteModal from '../views/view-delete-modal';
import ViewPropertiesModal from '../views/view-properties-modal';
import Canvas from 'app/modules/canvas/visualisation/canvas';
import VisualisationsDeleteModal from 'app/modules/canvas/visualisation/visualisation-modal/visualisation-delete-modal/visualisations-delete-modal';
import SearchModal from "app/entities/search/search-modal";
import ShareVisualisation from "app/entities/share/share-link-visualisation";

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/create`} component={DashboardCreateModal} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/properties`} component={DashboardPropertiesModal} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={DashboardDeleteModal} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/:viewId/properties`} component={ViewPropertiesModal} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/:viewId/delete`} component={ViewDeleteModal} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/:viewId/search`} component={SearchModal} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/create`} component={ViewCreateModal} />
      <ErrorBoundaryRoute exact path={`${match.url}/build`} component={Canvas} />
      <ErrorBoundaryRoute exact path={`${match.url}/share`} component={ShareVisualisation} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/:viewId/delete/:visualisationId`} component={VisualisationsDeleteModal} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={Views} />
      <ErrorBoundaryRoute path={match.url} component={Dashboard} />
    </Switch>
  </>
);

export default Routes;
