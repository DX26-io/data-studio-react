import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Views from './views';

const Routes = ({ match }) => (
  <>
    <Switch>
      {/* display all views */}
      {/* <ErrorBoundaryRoute path={match.url} component={Views} /> */}
    </Switch>
  </>
);

export default Routes;
