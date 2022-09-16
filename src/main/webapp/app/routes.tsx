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
import Signup from 'app/modules/signup/signup';
import Realm from 'app/modules/realm-management/realm-signup/realm';

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/account'),
  loading: () => <div>loading ...</div>,
});

const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "administration" */ 'app/modules/administration'),
  loading: () => <div>loading ...</div>,
});

const RealmManagement = Loadable({
  loader: () => import(/* webpackChunkName: "realmManagement" */ 'app/modules/realm-management/external-realm-management'),
  loading: () => <div>loading ...</div>,
});

const InternalRealmManagement = Loadable({
  loader: () => import(/* webpackChunkName: "InternalRealmManagement" */ 'app/modules/realm-management/internal-realm-management'),
  loading: () => <div>loading ...</div>,
});

const OrganisationManagement = Loadable({
  loader: () => import(/* webpackChunkName: "organisationManagement" */ 'app/modules/organisation-management'),
  loading: () => <div>loading ...</div>,
});

const Canvas = Loadable({
  loader: () => import(/* webpackChunkName: "Dx26" */ 'app/modules/canvas/visualisation'),
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
      <ErrorBoundaryRoute path="/activate/:key?" component={Activate} />
      <ErrorBoundaryRoute path="/reset/request" component={PasswordResetInit} />
      <ErrorBoundaryRoute path="/reset/finish/:key?" component={PasswordResetFinish} />
      <ErrorBoundaryRoute path="/canvas" component={Canvas} />
      <PrivateRoute path="/internal-realm-management" component={InternalRealmManagement} hasAnyAuthorities={[AUTHORITIES.SUPER_ADMIN]} />
      <PrivateRoute path="/realm-management" component={RealmManagement} hasAnyAuthorities={[AUTHORITIES.SUPER_ADMIN]} />
      <PrivateRoute path="/organisation-management" component={OrganisationManagement} hasAnyAuthorities={[AUTHORITIES.SUPER_ADMIN]} />
      <PrivateRoute path="/administration" component={Admin} hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.SUPER_ADMIN]} />
      <PrivateRoute
        path="/account"
        component={Account}
        hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER, AUTHORITIES.SUPER_ADMIN]}
      />
      <PrivateRoute path="/" exact component={Home} hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.SUPER_ADMIN, AUTHORITIES.ADMIN]} />
      <PrivateRoute path="/" component={Entities} hasAnyAuthorities={[AUTHORITIES.USER, AUTHORITIES.SUPER_ADMIN, AUTHORITIES.ADMIN]} />
      <ErrorBoundaryRoute component={PageNotFound} />
    </Switch>
  </div>
);

export default Routes;
