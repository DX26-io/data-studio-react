import React from 'react';
import { Switch } from 'react-router-dom';
import Login from 'app/modules/login/login';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

const LoginRoute = () => (
  <div className="view-routes">
    <Switch>
      <ErrorBoundaryRoute path="/login" component={Login} />
    </Switch>
  </div>
);

export default LoginRoute;
