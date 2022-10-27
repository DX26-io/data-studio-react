import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { ORGANISATION_TYPE_ENTERPRISE, ORGANISATION_TYPE_FULL } from 'app/config/constants';

export interface IPrivateRouteProps extends RouteProps, StateProps {
  hasAnyAuthorities?: string[];
  component: any;
}

export const PrivateRoute = (
props: IPrivateRouteProps) => {

const isAuthorized = hasAnyAuthority(props.account, props.hasAnyAuthorities)

  const checkAuthorities = props =>
    isAuthorized ? (
      <ErrorBoundary>
        <props.component {...props} />
      </ErrorBoundary>
    ) : (
      <div className="insufficient-authority">
        <div className="alert alert-danger">
          <Translate contentKey="error.http.403">You are not authorized to access this page.</Translate>
        </div>
      </div>
    );

  const renderRedirect = props => {
    if (!props.sessionHasBeenFetched) {
      return <div></div>;
    } else {
      return props.isAuthenticated ? (
        checkAuthorities(props)
      ) : (
        <Redirect
          to={{
            pathname: '/signin',
            search: props.location.search,
            state: { from: props.location },
          }}
        />
      );
    }
  };

  if (!props.component) throw new Error(`A component needs to be specified for private route for path ${(props as any).path}`);

  return <Route {...props}  render={renderRedirect} />;
};

export const hasAnyAuthority = (account: any, hasAnyAuthorities: string[]) => {
  if (account && account.userGroups && account.userGroups.length !== 0) {
    if (hasAnyAuthorities.length === 0) {
      return true;
    }
    if (window.location.href.includes('/realm-management')) {
      return (
        hasAnyAuthorities.some(auth => account.userGroups.includes(auth)) && account.organisation.type === ORGANISATION_TYPE_ENTERPRISE
      );
    } else if (window.location.href.includes('/internal-realm-management')) {
      return hasAnyAuthorities.some(auth => account.userGroups.includes(auth)) && account.organisation.type === ORGANISATION_TYPE_FULL;
    }
    return hasAnyAuthorities.some(auth => account.userGroups.includes(auth));
  }
  return false;
};

const mapStateToProps = (storeState: IRootState) => ({
  isAuthenticated: storeState.authentication.isAuthenticated,
  account: storeState.authentication.account,
  sessionHasBeenFetched: storeState.authentication.sessionHasBeenFetched,
});


type StateProps = ReturnType<typeof mapStateToProps>;

/**
 * A route wrapped in an authentication check so that routing happens only when you are authenticated.
 * Accepts same props as React router Route.
 * The route also checks for authorization if hasAnyAuthorities is specified.
 */
export default connect(mapStateToProps, null)(PrivateRoute);
