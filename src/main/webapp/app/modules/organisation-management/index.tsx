import React from 'react';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Organisations from './organisations';

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute path={`${match.url}`} component={Organisations} />
  </div>
);

export default Routes;
