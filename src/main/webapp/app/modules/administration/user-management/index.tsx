import React from 'react';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Users from './users';
import UserManagement from './user-management';


const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute exact path={match.url} component={UserManagement} />
    <ErrorBoundaryRoute exact path={`${match.url}/users`} component={Users} />
    {/* user group,permission module root route will be kept here */}
  </div>
);

export default Routes;
