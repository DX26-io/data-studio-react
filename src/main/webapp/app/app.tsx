import 'react-toastify/dist/ReactToastify.css';
import '../content/scss/main.scss';
import '@spectrum-css/typography/dist/index-vars.css';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Grid, View } from '@adobe/react-spectrum';
import { IRootState } from 'app/shared/reducers';
import { getSessionWithPath } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import { setLocale } from 'app/shared/reducers/locale';
import Header from 'app/shared/layout/header/header';
import HomeHeader from 'app/modules/home/home-header';
import Footer from 'app/shared/layout/footer/footer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import AppRoutes from 'app/routes';
import { isCanvas } from './shared/util/common-utils';
import  ShareVisualisationHeader  from 'app/entities/share/share-link-visualisation-header';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export interface IAppProps extends StateProps, DispatchProps { }

// TODO: Test Cases
export const App = (props: IAppProps) => {
  useEffect(() => {
    const pathname = window.location.pathname;
    props.getSessionWithPath(pathname);
    props.getProfile();
  }, []);

  return props.isAuthenticated ? (
    <Router basename={baseHref}>
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} className="toastify-container" toastClassName="toastify-toast" />
      <Grid
        areas={['header', 'content', 'footer']}
        columns={['1fr']}
        rows={['size-700', 'auto', 'size-400']}
        minHeight={window.innerHeight}
      >
        <View gridArea="header">
          <ErrorBoundary>

            {!props.isShareLinkPage ? (props.isHome ? (
              <HomeHeader />
            ) : (
              <Header
                isAuthenticated={props.isAuthenticated}
                isAdmin={props.isAdmin}
                currentLocale={props.currentLocale}
                onLocaleChange={props.setLocale}
                ribbonEnv={props.ribbonEnv}
                isInProduction={props.isInProduction}
                isSwaggerEnabled={props.isSwaggerEnabled}
                isCanvas={props.isCanvas}
                isHome={props.isHome}
              />
            )) :

              <ShareVisualisationHeader />

            }
          </ErrorBoundary>
        </View>
        <View gridArea="content" flex={true} alignSelf={'stretch'} backgroundColor="default">
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </View>
        <View gridArea="footer" position="fixed" bottom={0} backgroundColor="default">
          <Footer />
        </View>
      </Grid>
    </Router>
  ) : (
    <Router basename={baseHref}>
      {props.redirectTo ? (
        <Redirect
          to={{
            pathname: props.redirectTo,
          }}
        />
      ) : null}
      <ToastContainer position={toast.POSITION.BOTTOM_CENTER} className="toastify-container" toastClassName="toastify-toast" />
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </Router>
  );
};

const mapStateToProps = ({ authentication, applicationProfile, locale, home, shareLinkVisualisation }: IRootState) => ({
  currentLocale: locale.currentLocale,
  isAuthenticated: authentication.isAuthenticated,
  redirectTo: authentication.redirectTo,
  isAdmin: hasAnyAuthority(authentication.account.userGroups, [AUTHORITIES.ADMIN]),
  ribbonEnv: applicationProfile.ribbonEnv,
  isInProduction: applicationProfile.inProduction,
  isSwaggerEnabled: applicationProfile.isSwaggerEnabled,
  isCanvas: isCanvas(),
  isHome: home.isHome,
  isShareLinkPage: shareLinkVisualisation.isShareLinkPage
});

const mapDispatchToProps = { setLocale, getSessionWithPath, getProfile };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(App);
