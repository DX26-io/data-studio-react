import axios from 'axios';
import { Storage } from 'react-jhipster';
import firebase from 'firebase/app';

import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';
import { setLocale } from 'app/shared/reducers/locale';
import config from 'app/config/constants';
import { toast } from 'react-toastify';

export const ACTION_TYPES = {
  LOGIN: 'authentication/LOGIN',
  LOGIN_WITH_PROVIDER: 'authentication/LOGIN_WITH_PROVIDER',
  SIGNUP: 'authentication/SIGNUP',
  CREATE_REALM: 'authentication/CREATE_REALM',
  VERIFY_USER: 'authentication/VERIFY_USER',
  REALM_CREATED: 'authentication/REALM_CREATED',
  GET_SESSION: 'authentication/GET_SESSION',
  LOGOUT: 'authentication/LOGOUT',
  CLEAR_AUTH: 'authentication/CLEAR_AUTH',
  ERROR_MESSAGE: 'authentication/ERROR_MESSAGE',
};

const AUTH_TOKEN_KEY = 'jhi-authenticationToken';

const initialState = {
  loading: false,
  isAuthenticated: false,
  realmCreateError: false,
  redirectTo: (null as unknown) as string,
  loginSuccess: false,
  loginProviderEmailConfirmationToken: (null as unknown) as string,
  verifyUserSuccess: false,
  createRealmSuccess: false,
  realm: {} as any,
  signupSuccess: false,
  verifyEmailToken: (null as unknown) as string,
  loginError: false, // Errors returned from server side
  signupError: false, // Errors returned from server side
  createRealmError: false, // Errors returned from server side
  logoutError: false, // Errors returned from server side
  account: {} as any,
  errorMessage: (null as unknown) as string, // Errors returned from server side
  redirectMessage: (null as unknown) as string,
  sessionHasBeenFetched: false,
  idToken: (null as unknown) as string,
  logoutUrl: (null as unknown) as string,
};

export type AuthenticationState = Readonly<typeof initialState>;

// Reducer

export default (state: AuthenticationState = initialState, action): AuthenticationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.LOGIN):
    case REQUEST(ACTION_TYPES.LOGIN_WITH_PROVIDER):
    case REQUEST(ACTION_TYPES.SIGNUP):
    case REQUEST(ACTION_TYPES.CREATE_REALM):
    case REQUEST(ACTION_TYPES.VERIFY_USER):
    case REQUEST(ACTION_TYPES.LOGOUT):
    case REQUEST(ACTION_TYPES.GET_SESSION):
      return {
        ...state,
        loading: true,
        redirectTo: null,
      };
    case FAILURE(ACTION_TYPES.LOGIN):
    case FAILURE(ACTION_TYPES.LOGIN_WITH_PROVIDER):
      return {
        ...initialState,
        errorMessage: action.payload,
        loginError: true,
      };
    case FAILURE(ACTION_TYPES.SIGNUP):
      return {
        ...initialState,
        errorMessage: action.payload,
        signupError: true,
      };
    case FAILURE(ACTION_TYPES.CREATE_REALM):
    case FAILURE(ACTION_TYPES.VERIFY_USER):
      return {
        ...initialState,
        errorMessage: action.payload,
        createRealmError: true,
      };
    case FAILURE(ACTION_TYPES.LOGOUT):
      return {
        ...initialState,
        errorMessage: action.payload,
        logoutError: true,
      };
    case FAILURE(ACTION_TYPES.GET_SESSION):
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        sessionHasBeenFetched: true,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.LOGIN):
      return {
        ...state,
        loading: false,
        loginError: false,
        loginSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.LOGIN_WITH_PROVIDER):
      return {
        ...state,
        loading: false,
        loginError: false,
        loginProviderEmailConfirmationToken: action.payload.data.token,
      };
    case SUCCESS(ACTION_TYPES.SIGNUP):
      return {
        ...state,
        loading: false,
        signupError: false,
        signupSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.CREATE_REALM):
      return {
        ...state,
        loading: false,
        createRealmError: false,
        createRealmSuccess: true,
        realm: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.VERIFY_USER):
      return {
        ...state,
        loading: false,
        createRealmError: false,
        verifyUserSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.LOGOUT):
      return {
        ...initialState,
      };
    case SUCCESS(ACTION_TYPES.GET_SESSION): {
      const isAuthenticated = action.payload && action.payload.data && action.payload.data.activated;
      return {
        ...state,
        isAuthenticated,
        loading: false,
        sessionHasBeenFetched: true,
        account: action.payload.data,
      };
    }
    case ACTION_TYPES.ERROR_MESSAGE:
      return {
        ...initialState,
        redirectMessage: action.message,
      };
    case ACTION_TYPES.CLEAR_AUTH:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        redirectTo: '/',
      };
    case ACTION_TYPES.REALM_CREATED:
      return {
        ...state,
        redirectTo: '/',
      };
    default:
      return state;
  }
};

export const displayAuthError = message => ({ type: ACTION_TYPES.ERROR_MESSAGE, message });

export const getSession: () => void = () => async (dispatch, getState) => {
  await dispatch({
    type: ACTION_TYPES.GET_SESSION,
    payload: axios.get('api/account'),
  });

  const { account } = getState().authentication;
  if (account && account.langKey) {
    const langKey = Storage.session.get('locale', account.langKey);
    await dispatch(setLocale(langKey));
  }
};

export const setAuthToken = async (result, rememberMe) => {
  const bearerToken = result.value.headers.authorization;
  if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
    const jwt = bearerToken.slice(7, bearerToken.length);

    try {
      let tkn: string;
      if (config.CLOUD) {
        await firebase.auth().signInWithCustomToken(jwt);
        tkn = await firebase.auth().currentUser.getIdToken(true);
      } else {
        tkn = jwt;
      }
      if (rememberMe) {
        Storage.local.set(AUTH_TOKEN_KEY, tkn);
      } else {
        Storage.session.set(AUTH_TOKEN_KEY, tkn);
      }
    } catch (error) {
      const errorMessage = error.message;
      toast.error(errorMessage);
    }
  }
};

const setAuthTokenWithProvider = result => {
  const bearerToken = result.value.headers.authorization;
  if (!(bearerToken && bearerToken.slice(0, 7) === 'Bearer ')) {
    return;
  }
  const jwt = bearerToken.slice(7, bearerToken.length);
  Storage.local.set(AUTH_TOKEN_KEY, jwt);
};

export const signup: (username: string, email: string, password: string, firstname: string, lastname: string) => void = (
  username,
  email,
  password,
  firstname,
  lastname
) => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.SIGNUP,
    payload: axios.post('api/signup', {
      username,
      email,
      password,
      firstname,
      lastname,
    }),
  });
};

export const createRealm: (realmName: string, emailVerificationToken: string) => void = (realmName, emailVerificationToken) => async (
  dispatch,
  getState
) => {
  await dispatch({
    type: ACTION_TYPES.CREATE_REALM,
    payload: axios.post('api/realms-anonym', {
      name: realmName,
    }),
  });

  const realm = getState().authentication.realm;
  const emailToken = getState().authentication.loginProviderEmailConfirmationToken || emailVerificationToken;

  const result = await dispatch({
    type: ACTION_TYPES.VERIFY_USER,
    payload: axios.post('api/confirm_user', {
      realmId: realm.id,
      realmCreationToken: realm.token,
      emailVerificationToken: emailToken,
    }),
  });

  await setAuthToken(result, false);
  await dispatch(getSession());

  dispatch({
    type: ACTION_TYPES.REALM_CREATED,
  });
};

export const login: (username: string, password: string, rememberMe?: boolean) => void = (
  username,
  password,
  rememberMe = false
) => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.LOGIN,
    payload: axios.post('api/authenticate', { username, password, rememberMe }),
  });
  await setAuthToken(result, rememberMe);
  await dispatch(getSession());
};

export const loginWithProvider: (provider: string) => void = provider => async (dispatch, getState) => {
  const firebaseProviders = {
    google: new firebase.auth.GoogleAuthProvider(),
    github: new firebase.auth.GithubAuthProvider(),
  };
  const authProvider = firebaseProviders[provider];
  try {
    await firebase.auth().signInWithPopup(authProvider);
    const tkn = await firebase.auth().currentUser.getIdToken(true);
    const result = await dispatch({
      type: ACTION_TYPES.LOGIN_WITH_PROVIDER,
      payload: axios.post('api/registerWithProvider', { idToken: tkn }),
    });
    setAuthTokenWithProvider(result);
    if (!getState().authentication.loginProviderEmailConfirmationToken) {
      await dispatch(getSession());
    }
  } catch (error) {
    toast.error(error.message);
  }
};

export const clearAuthToken = () => {
  if (Storage.local.get(AUTH_TOKEN_KEY)) {
    Storage.local.remove(AUTH_TOKEN_KEY);
  }
  if (Storage.session.get(AUTH_TOKEN_KEY)) {
    Storage.session.remove(AUTH_TOKEN_KEY);
  }
};

const firebaseLogout = () => {
  if (config.CLOUD) {
    firebase.auth().signOut();
  }
};

export const logout: () => void = () => dispatch => {
  clearAuthToken();
  firebaseLogout();
  dispatch({
    type: ACTION_TYPES.LOGOUT,
    payload: axios.get('api/logout'),
  });
};

export const clearAuthentication = messageKey => (dispatch, getState) => {
  clearAuthToken();
  dispatch(displayAuthError(messageKey));
  dispatch({
    type: ACTION_TYPES.CLEAR_AUTH,
  });
};

export const isTokenExist = () => {
  const token = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
  return token ? true : false;
};

export const getToken = () => {
  return Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
};
