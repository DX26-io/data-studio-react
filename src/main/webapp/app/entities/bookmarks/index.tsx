import React from 'react';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Bookmarks from './bookmarks';

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute exact path={match.url} component={Bookmarks} />
  </div>
);

export default Routes;
