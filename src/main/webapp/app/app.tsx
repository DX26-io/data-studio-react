import 'react-toastify/dist/ReactToastify.css';
import '../content/scss/main.scss';
import '@spectrum-css/typography/dist/index-vars.css'
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { hot } from 'react-hot-loader';
import {Grid, View} from '@adobe/react-spectrum'

import { IRootState } from 'app/shared/reducers';
import { getSession,isTokenExist } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import { setLocale } from 'app/shared/reducers/locale';
import Header from 'app/shared/layout/header/Header';
import Footer from 'app/shared/layout/footer/footer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import AppRoutes from 'app/routes';
import LoginRoute from 'app/login-route';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

export interface IAppProps extends StateProps, DispatchProps {}

// TODO: Test Cases
export const App = (props: IAppProps) => {
  // TODO: If possible, remove the usage of computed content height and control it through styling
  const [contentSize, setContentSize] = useState(window.innerHeight)
  const updateContentHeight = () => {
    setContentSize(window.innerHeight)
  }

  useEffect(() => {
    props.getSession();
    props.getProfile();
    window.removeEventListener('resize', updateContentHeight);
  }, [contentSize]);

  return (
    <Router basename={baseHref}>
      { isTokenExist() || props.isAuthenticated ?
        <>
          <ToastContainer
            position={toast.POSITION.TOP_LEFT}
            className="toastify-container"
            toastClassName="toastify-toast" />
          <Grid
            areas={['header', 'content', 'footer']}
            columns={['1fr']}
            rows={['size-700', 'auto', 'size-400']}
            minHeight={contentSize}
          >
            <View gridArea="header">
              <ErrorBoundary>
                <Header
                  isAuthenticated={props.isAuthenticated}
                  isAdmin={props.isAdmin}
                  currentLocale={props.currentLocale}
                  onLocaleChange={props.setLocale}
                  ribbonEnv={props.ribbonEnv}
                  isInProduction={props.isInProduction}
                  isSwaggerEnabled={props.isSwaggerEnabled}
                />
              </ErrorBoundary>
            </View>
            <View
              gridArea="content"
              flex={true} alignSelf={'stretch'}
              backgroundColor="default">
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </View>
            <View
              gridArea="footer"
              backgroundColor="default">
              <Footer />
            </View>
          </Grid>
        </>
      :
        <LoginRoute />
      }
    </Router>
  );
};

const mapStateToProps = ({ authentication, applicationProfile, locale }: IRootState) => ({
  currentLocale: locale.currentLocale,
  isAuthenticated: authentication.isAuthenticated,
  isAdmin: hasAnyAuthority(authentication.account.userGroups, [AUTHORITIES.ADMIN]),
  ribbonEnv: applicationProfile.ribbonEnv,
  isInProduction: applicationProfile.inProduction,
  isSwaggerEnabled: applicationProfile.isSwaggerEnabled,
});

const mapDispatchToProps = { setLocale, getSession, getProfile };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(hot(module)(App));
