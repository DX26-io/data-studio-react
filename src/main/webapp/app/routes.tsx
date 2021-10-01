import React from 'react';
import { Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import Register from 'app/modules/account/register/register';
import Activate from 'app/modules/account/activate/activate';
import PasswordResetInit from 'app/modules/account/password-reset/init/password-reset-init';
import PasswordResetFinish from 'app/modules/account/password-reset/finish/password-reset-finish';
import Logout from 'app/modules/login/logout';
import Home from 'app/modules/home/home';
import Entities from 'app/entities';
import PrivateRoute from 'app/shared/auth/private-route';
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';
import { AUTHORITIES } from 'app/config/constants';
import Login from 'app/modules/login/login';
import Signup from "app/modules/signup/signup";
import Realm from "app/modules/realm/realm";
import exportVisualization from './modules/canvas/export/export-visualization';

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/account'),
  loading: () => <div>loading ...</div>,
});

const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "administration" */ 'app/modules/administration'),
  loading: () => <div>loading ...</div>,
});

const Canvas = Loadable({
  loader: () => import(/* webpackChunkName: "Dx26" */ 'app/modules/canvas/visualization'),
  loading: () => <div>loading ...</div>,
});

const Routes = () => (
  <div className="view-routes">
    <Switch>
      <ErrorBoundaryRoute path="/signin" component={Login} />
      <ErrorBoundaryRoute path="/logout" component={Logout} />
      <ErrorBoundaryRoute path="/signup" exact component={Signup} />
      <ErrorBoundaryRoute path="/realm" component={Realm} />
      <ErrorBoundaryRoute path="/account/register" component={Register} />
      <ErrorBoundaryRoute path="/account/activate/:key?" component={Activate} />
      <ErrorBoundaryRoute path="/account/reset/request" component={PasswordResetInit} />
      <ErrorBoundaryRoute path="/account/reset/finish/:key?" component={PasswordResetFinish} />
      <ErrorBoundaryRoute exact path={`/export-visualisation`} component={exportVisualization} />
      <ErrorBoundaryRoute path="/canvas" component={Canvas} />

      <PrivateRoute path="/administration" component={Admin} hasAnyAuthorities={[AUTHORITIES.ADMIN]} />
      <PrivateRoute path="/account" component={Account} hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]} />
      <PrivateRoute path="/" exact component={Home} hasAnyAuthorities={[AUTHORITIES.USER]} />
      <PrivateRoute path="/" component={Entities} hasAnyAuthorities={[AUTHORITIES.USER]} />
      <ErrorBoundaryRoute component={PageNotFound} />
    </Switch>
  </div>
);

export default Routes;
