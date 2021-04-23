import 'react-toastify/dist/ReactToastify.css';
import '../content/scss/main.scss';
import '@spectrum-css/typography/dist/index-vars.css';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { hot } from 'react-hot-loader';
import { Grid, View } from '@adobe/react-spectrum';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import { setLocale } from 'app/shared/reducers/locale';
import Header from 'app/shared/layout/header/header';
import HomeHeader from 'app/modules/home/home-header';
import Footer from 'app/shared/layout/footer/footer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import AppRoutes from 'app/routes';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');
const noSessionPathNames = ['/realm', '/signin', '/signup'];

export interface IAppProps extends StateProps, DispatchProps {}

// TODO: Test Cases
export const App = (props: IAppProps) => {
  useEffect(() => {
    const pathname = window.location.pathname;
    if (!noSessionPathNames.includes(pathname)) {
      props.getSession();
    }
    props.getProfile();
  }, []);

  return props.isAuthenticated ? (
    <Router basename={baseHref}>
      <ToastContainer position={toast.POSITION.BOTTOM_CENTER} className="toastify-container" toastClassName="toastify-toast" />
      <Grid
        areas={['header', 'content', 'footer']}
        columns={['1fr']}
        rows={['size-700', 'auto', 'size-400']}
        minHeight={window.innerHeight}
      >
        <View gridArea="header">
          <ErrorBoundary>
            {props.isHome ? (
              <HomeHeader
                isAuthenticated={props.isAuthenticated}
                isAdmin={props.isAdmin}
                currentLocale={props.currentLocale}
                onLocaleChange={props.setLocale}
                ribbonEnv={props.ribbonEnv}
                isInProduction={props.isInProduction}
                isSwaggerEnabled={props.isSwaggerEnabled}
              />
            ) : (
              <Header
                isAuthenticated={props.isAuthenticated}
                isAdmin={props.isAdmin}
                currentLocale={props.currentLocale}
                onLocaleChange={props.setLocale}
                ribbonEnv={props.ribbonEnv}
                isInProduction={props.isInProduction}
                isSwaggerEnabled={props.isSwaggerEnabled}
              />
            )}
          </ErrorBoundary>
        </View>
        <View gridArea="content" flex={true} alignSelf={'stretch'} backgroundColor="default">
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </View>
        <View gridArea="footer" backgroundColor="default">
          <Footer />
        </View>
      </Grid>
    </Router>
  ) : (
    <Router basename={baseHref}>
      <ToastContainer position={toast.POSITION.BOTTOM_CENTER} className="toastify-container" toastClassName="toastify-toast" />
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </Router>
  );
};

const mapStateToProps = ({ authentication, applicationProfile, locale, home }: IRootState) => ({
  currentLocale: locale.currentLocale,
  isAuthenticated: authentication.isAuthenticated,
  isAdmin: hasAnyAuthority(authentication.account.userGroups, [AUTHORITIES.ADMIN]),
  ribbonEnv: applicationProfile.ribbonEnv,
  isInProduction: applicationProfile.inProduction,
  isSwaggerEnabled: applicationProfile.isSwaggerEnabled,
  isHome: home.isHome,
});

const mapDispatchToProps = { setLocale, getSession, getProfile };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(hot(module)(App));
