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
import Canvas from 'app/modules/canvas/visualization/canvas';
import VisualizationEditModal from 'app/modules/canvas/visualization/visualization-modal/visualization-edit-modal/visualization-edit-modal';
import VisualizationsDeleteModal from 'app/modules/canvas/visualization/visualization-modal/visualization-delete-modal/visualizations-delete-modal';
import FeaturesCreateModal from "app/entities/feature/feature-update";
import SearchModal from "app/entities/search/search-modal";
import ShareVisualization from "app/entities/share/share-visualization";

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
      <ErrorBoundaryRoute exact path={`${match.url}/:id/:viewId/build/:bookmarkId?`} component={Canvas} />

      <ErrorBoundaryRoute exact path={`${match.url}/build`} component={Canvas} />
      <ErrorBoundaryRoute exact path={`${match.url}/share`} component={ShareVisualization} />


      <ErrorBoundaryRoute exact path={`${match.url}/:id/:viewId/edit/:visualizationId`} component={VisualizationEditModal} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/:viewId/delete/:visualizationId`} component={VisualizationsDeleteModal} />

      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={Views} />
      <ErrorBoundaryRoute path={match.url} component={Dashboard} />
    </Switch>
  </>
);

export default Routes;
