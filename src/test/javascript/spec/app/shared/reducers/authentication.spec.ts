import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import thunk from 'redux-thunk';
import axios from 'axios';
import sinon from 'sinon';
import { Storage } from 'react-jhipster';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';

import authentication, {
  ACTION_TYPES,
  getSession,
  login,
  clearAuthentication,
  logout,
  clearAuthToken,
  setAuthToken,
} from 'app/shared/reducers/authentication';
import { ACTION_TYPES as localeActionTypes } from 'app/shared/reducers/locale';

describe('Authentication reducer tests', () => {
  function isAccountEmpty(state): boolean {
    return Object.keys(state.account).length === 0;
  }

  describe('Common tests', () => {
    it('should return the initial state', () => {
      const toTest = authentication(undefined, {});
      expect(toTest).toMatchObject({
        loading: false,
        isAuthenticated: false,
        errorMessage: null, // Errors returned from server side
        loginSuccess: false,
        loginError: false, // Errors returned from server side
        redirectMessage: null,
      });
      expect(isAccountEmpty(toTest));
    });
  });

  describe('Requests', () => {
    it('should detect a request', () => {
      expect(authentication(undefined, { type: REQUEST(ACTION_TYPES.LOGIN) })).toMatchObject({
        loginSuccess: false,
        loginError: false,
      });
      expect(authentication(undefined, { type: REQUEST(ACTION_TYPES.GET_SESSION) })).toMatchObject({
        loading: true,
      });
    });
  });

  describe('Success', () => {
    it('should detect a success on login', () => {
      const payload = { data: { idToken: 'test token', realms: null } };
      const toTest = authentication(undefined, { type: SUCCESS(ACTION_TYPES.LOGIN), payload });
      expect(toTest).toMatchObject({
        loading: false,
        loginError: false,
        loginSuccess: true,
      });
    });

    it('should detect a success on get session and be authenticated', () => {
      const payload = { data: { activated: true } };
      const toTest = authentication(undefined, { type: SUCCESS(ACTION_TYPES.GET_SESSION), payload });
      expect(toTest).toMatchObject({
        isAuthenticated: true,
        loading: false,
        account: payload.data,
      });
    });

    it('should detect a success on get session and not be authenticated', () => {
      const payload = { data: { activated: false } };
      const toTest = authentication(undefined, { type: SUCCESS(ACTION_TYPES.GET_SESSION), payload });
      expect(toTest).toMatchObject({
        isAuthenticated: false,
        loading: false,
        account: payload.data,
      });
    });
  });

  describe('Failure', () => {
    it('should detect a failure on login', () => {
      const toTest = authentication(undefined, { type: FAILURE(ACTION_TYPES.LOGIN) });
      expect(toTest).toMatchObject({
        loginSuccess: false,
        loginError: false,
      });
      expect(isAccountEmpty(toTest));
    });

    it('should detect a failure', () => {
      const payload = 'Something happened.';
      const toTest = authentication(undefined, { type: FAILURE(ACTION_TYPES.GET_SESSION), payload });

      expect(toTest).toMatchObject({
        loading: false,
        isAuthenticated: false,
        errorMessage: payload,
      });
      expect(isAccountEmpty(toTest));
    });
  });

  describe('Other cases', () => {
    it('should properly reset the current state when a logout is requested', () => {
      const toTest = authentication(undefined, { type: ACTION_TYPES.LOGOUT });
      expect(toTest).toMatchObject({
        loading: false,
        isAuthenticated: false,
        loginSuccess: false,
        loginError: false,
        errorMessage: null,
        redirectMessage: null,
      });
      expect(isAccountEmpty(toTest));
    });

    it('should properly define an error message and change the current state to display the login modal', () => {
      const message = 'redirect me please';
      const toTest = authentication(undefined, { type: ACTION_TYPES.ERROR_MESSAGE, message });
      expect(toTest).toMatchObject({
        loading: false,
        isAuthenticated: false,
        loginSuccess: false,
        loginError: false,
        errorMessage: null,
        redirectMessage: message,
      });
      expect(isAccountEmpty(toTest));
    });

    it('should clear authentication', () => {
      const message = 'redirect me please';
      const toTest = authentication(undefined, { type: ACTION_TYPES.CLEAR_AUTH, message });
      expect(toTest).toMatchObject({
        loading: false,
        isAuthenticated: false,
      });
    });
  });

  describe('Actions', () => {
    let store;

    const resolvedObject = { value: 'whatever' };
    beforeEach(() => {
      const mockStore = configureStore([thunk, promiseMiddleware]);
      store = mockStore({ authentication: { account: { langKey: 'en' } } });
      axios.get = sinon.stub().returns(Promise.resolve(resolvedObject));
    });

    it('dispatches GET_SESSION_PENDING and GET_SESSION_FULFILLED actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.GET_SESSION),
        },
        {
          type: SUCCESS(ACTION_TYPES.GET_SESSION),
          payload: resolvedObject,
        },
        {
          type: localeActionTypes.SET_LOCALE,
          locale: 'en',
        },
      ];
      await store.dispatch(getSession());
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('dispatches LOGOUT actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.LOGOUT),
        },

        {
          payload: {
            value: 'whatever',
          },
          type: SUCCESS(ACTION_TYPES.LOGOUT),
        },
      ];
      await store.dispatch(logout());
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('dispatches CLEAR_AUTH actions', async () => {
      const expectedActions = [
        {
          message: 'message',
          type: ACTION_TYPES.ERROR_MESSAGE,
        },
        {
          type: ACTION_TYPES.CLEAR_AUTH,
        },
      ];
      await store.dispatch(clearAuthentication('message'));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('dispatches LOGIN, GET_SESSION and SET_LOCALE success and request actions', async () => {
      const loginResponse = { data: { idToken: 'test token', realms: null } };
      axios.post = sinon.stub().returns(Promise.resolve(loginResponse));
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.LOGIN),
        },
        {
          type: SUCCESS(ACTION_TYPES.LOGIN),
          payload: loginResponse,
        },
      ];
      await store.dispatch(login('test', 'test', false, 1));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
  describe('clearAuthToken', () => {
    let store;
    beforeEach(() => {
      const mockStore = configureStore([thunk, promiseMiddleware]);
      store = mockStore({ authentication: { account: { langKey: 'en' } } });
    });
    it('clears the session token on clearAuthToken', async () => {
      const AUTH_TOKEN_KEY = 'jhi-authenticationToken';
      const loginResponse = { data: { token: 'TestToken', realms: null } };
      axios.post = sinon.stub().returns(Promise.resolve(loginResponse));
      store.dispatch(login('test', 'test', false, 1));
      setAuthToken(loginResponse.data.token, false);
      expect(Storage.session.get(AUTH_TOKEN_KEY)).toBe(loginResponse.data.token);
      expect(Storage.local.get(AUTH_TOKEN_KEY)).toBe(undefined);
      clearAuthToken();
      expect(Storage.session.get(AUTH_TOKEN_KEY)).toBe(undefined);
      expect(Storage.local.get(AUTH_TOKEN_KEY)).toBe(undefined);
    });
  });
});
