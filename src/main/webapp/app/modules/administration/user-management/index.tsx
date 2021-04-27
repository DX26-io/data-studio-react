import React from 'react';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Users from './users/users';
import UserGroups from './groups/user-groups';
import Permission from './permissions/dashboards/dashboard-permissions-container';
import DatasourcePermissionContainer from './permissions/datasources/datasource-permissions-container';

import UserManagement from './user-management';


const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute exact path={match.url} component={UserManagement} />
    <ErrorBoundaryRoute exact path={`${match.url}/users`} component={Users} />
    <ErrorBoundaryRoute exact path={`${match.url}/groups`} component={UserGroups} />
    <ErrorBoundaryRoute exact path={`${match.url}/dashboard-permissions`} component={Permission} />
    <ErrorBoundaryRoute exact path={`${match.url}/datasource-permissions`} component={DatasourcePermissionContainer} />

  </div>
);

export default Routes;
