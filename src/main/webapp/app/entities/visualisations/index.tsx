import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import visualisations from './visualisations';


const Routes = ({ match }) => (
  <>
    <Switch>

      <ErrorBoundaryRoute path={match.url} component={visualisations} />
    </Switch>
  </>
);

export default Routes;
