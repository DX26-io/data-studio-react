import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Visualizations from './visualizations';


const Routes = ({ match }) => (
  <>
    <Switch>

      <ErrorBoundaryRoute path={match.url} component={Visualizations} />
    </Switch>
  </>
);

export default Routes;
