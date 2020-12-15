import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import UserGroups from './user-groups';

const Routes = ({ match }) => (
  <div>
    <Switch>
    <ErrorBoundaryRoute path={match.url} component={UserGroups} />
    </Switch>
  </div>
);


export default Routes;
