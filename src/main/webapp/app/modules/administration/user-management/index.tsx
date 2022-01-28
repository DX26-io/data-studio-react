import React from 'react';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Users from './users/users';
import UserGroups from './groups/user-groups';
import DashboardPermissionsContainer from './permissions/dashboards/dashboard-permissions-container';
import DatasourcePermissionContainer from './permissions/datasources/datasource-permissions-container';
import DatasourceConstraints from './permissions/datasource-constraints/datasource-constraints';
import UserManagement from './user-management';

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute exact path={match.url} component={UserManagement} />
    <ErrorBoundaryRoute exact path={`${match.url}/users`} component={Users} />
    <ErrorBoundaryRoute exact path={`${match.url}/groups`} component={UserGroups} />
    <ErrorBoundaryRoute exact path={`${match.url}/dashboard-permissions`} component={DashboardPermissionsContainer} />
    <ErrorBoundaryRoute exact path={`${match.url}/datasource-permissions`} component={DatasourcePermissionContainer} />
    <ErrorBoundaryRoute exact path={`${match.url}/datasource-constraints`} component={DatasourceConstraints} />
  </div>
);

export default Routes;
