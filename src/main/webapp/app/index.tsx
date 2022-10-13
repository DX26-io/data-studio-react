import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { bindActionCreators } from 'redux';

import DevTools from './config/devtools';
import initStore from './config/store';
import { registerLocale } from './config/translation';
import setupAxiosInterceptors from './config/axios-interceptor';
import { clearAuthentication } from './shared/reducers/authentication';
import ErrorBoundary from './shared/error/error-boundary';
import AppComponent from './app';
import { loadIcons } from './config/icon-loader';
import firebaseConfig from './config/firebase';
import { defaultTheme, Provider as SpectrumProvider } from '@adobe/react-spectrum';
import firebase from "firebase/app";
import "firebase/auth";
import {FirebaseAuthProvider} from "@react-firebase/auth";
import {loadConfig} from "app/config/config-loader";
import { createRoot } from 'react-dom/client';

const devTools = process.env.NODE_ENV === 'development' ? <DevTools /> : null;

const store = initStore();
registerLocale(store);

const actions = bindActionCreators({ clearAuthentication }, store.dispatch);
setupAxiosInterceptors(() => actions.clearAuthentication('login.error.unauthorized'));

// TODO: FIX ESlint issue
// eslint-disable-next-line
async function init() {
  // loadIcons();
  await loadConfig();

  const container = document.getElementById('root');
  const root = createRoot(container!);

  const render = Component =>
    // eslint-disable-next-line react/no-render-return-value
    root.render(
      <ErrorBoundary>
        <SpectrumProvider theme={defaultTheme}>
          <Provider store={store}>
             {/* eslint-disable  */}
            <FirebaseAuthProvider {...firebaseConfig} firebase={firebase}>
              <div>
                {/* If this slows down the app in dev disable it and enable when required  */}
                {devTools}
                <Component/>
              </div>
            </FirebaseAuthProvider>
          </Provider>
        </SpectrumProvider>
      </ErrorBoundary>
    );

  render(AppComponent);
}

init();
