import React from 'react';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import UserManagement from './user-management';
import Logs from './logs/logs';
import Health from './health/health';
import Metrics from './metrics/metrics';
import Configuration from './configuration/configuration';
import Audits from './audits/audits';
import Docs from './docs/docs';
import Sources from './sources';
import ReportConfiguration from "./reports-configuration";
import ReleaseMangement from "./release-management";
import Visualizationcolors from "./visualization-colors/visualizationcolors";


const Routes = ({ match }) => (
  <div>
    <ErrorBoundaryRoute path={`${match.url}/reports-configuration`} component={ReportConfiguration} />
    <ErrorBoundaryRoute path={`${match.url}/user-management`} component={UserManagement} />
    <ErrorBoundaryRoute path={`${match.url}/sources`} component={Sources} />
    <ErrorBoundaryRoute path={`${match.url}/release-management`} component={ReleaseMangement} />
    <ErrorBoundaryRoute exact path={`${match.url}/health`} component={Health} />
    <ErrorBoundaryRoute exact path={`${match.url}/metrics`} component={Metrics} />
    <ErrorBoundaryRoute exact path={`${match.url}/docs`} component={Docs} />
    <ErrorBoundaryRoute exact path={`${match.url}/configuration`} component={Configuration} />
    <ErrorBoundaryRoute exact path={`${match.url}/audits`} component={Audits} />
    <ErrorBoundaryRoute exact path={`${match.url}/logs`} component={Logs} />
    <ErrorBoundaryRoute exact path={`${match.url}/visualization-colors`} component={Visualizationcolors} />

  </div>
);

export default Routes;
