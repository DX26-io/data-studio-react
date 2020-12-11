import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import UserManagementUsers from '../users/user-management-users';
import UserManagementDetail from '../users/user-management-detail';
import UserManagementUpdate from '../users/user-management-update';
import UserManagementDeleteDialog from './user-management-delete-dialog';

const Routes = ({ match }) => (
  <div>
    <Switch>
    <ErrorBoundaryRoute path={match.url} component={UserManagementUsers} />
    </Switch>
  </div>
);


export default Routes;
