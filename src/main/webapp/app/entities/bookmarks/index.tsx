import React from 'react';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import BookmarksContainer from './bookmarks-container';

const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute exact path={match.url} component={BookmarksContainer} />
  </div>
);

export default Routes;
