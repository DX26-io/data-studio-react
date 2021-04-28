import React from 'react';
import { Switch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Dashboard from './dashboard';
import Views from './views';
import ReportsManagement from "./reports-management";
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}dashboards`} component={Dashboard} />
      <ErrorBoundaryRoute path={`${match.url}views`} component={Views} />
      <ErrorBoundaryRoute path={`${match.url}reports-management`} component={ReportsManagement} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
