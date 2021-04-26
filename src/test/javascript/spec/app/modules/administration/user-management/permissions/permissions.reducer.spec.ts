import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import axios from 'axios';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import permission, {
  ACTION_TYPES,
  getUserDashboardPermissions,
  getUserGroupViewsPermissions,
  resetViewsPermissions,
  getUserGroupDashboardPermissions,
  getUserViewsPermissions,
  updateUserGroupPermissions,
  updateUserPermissions,
} from 'app/modules/administration/user-management/permissions/permissions.reducer';

describe('permissions reducer tests', () => {
  const username = process.env.E2E_USER_GROUPNAME || 'admin';
  function isEmpty(element): boolean {
    if (element instanceof Array) {
      return element.length === 0;
    } else {
      return Object.keys(element).length === 0;
    }
  }

  function testInitialState(state) {
    expect(state).toMatchObject({
      loading: false,
      errorMessage: null,
      dashboardPermissions: [],
      totalDashboardPermissions: 0,
      viewsPermissions: [],
      totalViewsPermissions: 0,
      updateSuccess: false,
      updating: false,
    });
    expect(isEmpty(state.dashboardPermissions));
    expect(isEmpty(state.viewsPermissions));
  }

  function testMultipleTypes(types, payload, testFunction) {
    types.forEach(e => {
      testFunction(permission(undefined, { type: e, payload }));
    });
  }

  describe('Common', () => {
    it('should return the initial state', () => {
      testInitialState(permission(undefined, {}));
    });
  });

  describe('Requests', () => {
    it('should set state to loading', () => {
      testMultipleTypes([REQUEST(ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS), REQUEST(ACTION_TYPES.FETCH_VIEWS_PERMISSIONS)], {}, state => {
        expect(state).toMatchObject({
          errorMessage: null,
          loading: true,
        });
      });
    });

    it('should set state to updating', () => {
      testMultipleTypes([REQUEST(ACTION_TYPES.UPDATE_PERMISSIONS)], {}, state => {
        expect(state).toMatchObject({
          errorMessage: null,
          updateSuccess: false,
          updating: true,
        });
      });
    });
  });

  describe('Failures', () => {
    it('should set state to failed and put an error message in errorMessage', () => {
      testMultipleTypes(
        [
          FAILURE(ACTION_TYPES.FETCH_VIEWS_PERMISSIONS),
          FAILURE(ACTION_TYPES.FETCH_VIEWS_PERMISSIONS),
          FAILURE(ACTION_TYPES.UPDATE_PERMISSIONS),
        ],
        'something happened',
        state => {
          expect(state).toMatchObject({
            loading: false,
            updating: false,
            updateSuccess: false,
            errorMessage: 'something happened',
          });
        }
      );
    });
  });

  describe('Success', () => {
    it('should update state according to a successful fetch dashboards permissions request', () => {
      const headers = { ['x-total-count']: 42 };
      const payload = { data: 'some handsome users', headers };
      const toTest = permission(undefined, { type: SUCCESS(ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS), payload });

      expect(toTest).toMatchObject({
        loading: false,
        dashboardPermissions: payload.data,
        totalDashboardPermissions: headers['x-total-count'],
      });
    });

    it('should update state according to a successful fetch views permissions request', () => {
      const headers = { ['x-total-count']: 42 };
      const payload = { data: 'some handsome users', headers };
      const toTest = permission(undefined, { type: SUCCESS(ACTION_TYPES.FETCH_VIEWS_PERMISSIONS), payload });

      expect(toTest).toMatchObject({
        loading: false,
        viewsPermissions: payload.data,
        totalViewsPermissions: headers['x-total-count'],
      });
    });

    it('should set state to successful update of views permissions', () => {
      const payload = [
        { id: 'READ_1002_DASHBOARD', action: 'ADD' },
        { id: 'READ_1004_VIEW', action: 'ADD' },
      ];
      testMultipleTypes([SUCCESS(ACTION_TYPES.UPDATE_PERMISSIONS)], payload, types => {
        expect(types).toMatchObject({
          loading: false,
          updateSuccess: true,
          updating: false,
        });
      });
    });
  });

  describe('Reset', () => {
    it('should reset views permissions state', () => {
      const initialState = {
        loading: false,
        errorMessage: null,
        dashboardPermissions: [],
        totalDashboardPermissions: 0,
        viewsPermissions: [],
        totalViewsPermissions: 0,
        updateSuccess: false,
        updating: false,
      };
      const payload = {
        ...initialState,
        loading: false,
        updateSuccess: false,
        viewsPermissions: [],
        totalViewsPermissions: 0,
      };
      expect(
        permission(payload, {
          type: ACTION_TYPES.RESET_VIEWS_PERMISSIONS,
        })
      ).toEqual(initialState);
    });
  });

  describe('Actions', () => {
    let store;

    const resolvedObject = { value: 'whatever' };
    beforeEach(() => {
      const mockStore = configureStore([thunk, promiseMiddleware]);
      store = mockStore({});
      axios.get = sinon.stub().returns(Promise.resolve(resolvedObject));
      axios.put = sinon.stub().returns(Promise.resolve(resolvedObject));
    });

    it('dispatches User FETCH_DASHBOARD_PERMISSIONS_PENDING and FETCH_DASHBOARD_PERMISSIONS_FULFILLED actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS),
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(getUserDashboardPermissions(1, 10, 'admin')).then(() => expect(store.getActions()).toEqual(expectedActions));
    });
    it('dispatches User Group FETCH_DASHBOARD_PERMISSIONS_PENDING and FETCH_DASHBOARD_PERMISSIONS_FULFILLED actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS),
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS),
          payload: resolvedObject,
        },
      ];
      await store
        .dispatch(getUserGroupDashboardPermissions(1, 10, 'role_test'))
        .then(() => expect(store.getActions()).toEqual(expectedActions));
    });
    it('dispatches User FETCH_VIEWS_PERMISSIONS_PENDING and FETCH_VIEWS_PERMISSIONS_FULFILLED actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_VIEWS_PERMISSIONS),
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_VIEWS_PERMISSIONS),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(getUserViewsPermissions(1, 10, 'admin', 1)).then(() => expect(store.getActions()).toEqual(expectedActions));
    });
    it('dispatches User Group FETCH_VIEWS_PERMISSIONS_PENDING and FETCH_VIEWS_PERMISSIONS_FULFILLED actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_VIEWS_PERMISSIONS),
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_VIEWS_PERMISSIONS),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(getUserGroupViewsPermissions(1, 10, 'admin', 1)).then(() => expect(store.getActions()).toEqual(expectedActions));
    });
    it('dispatches User UPDATE_PERMISSIONS_PENDING and UPDATE_PERMISSIONS_FULFILLED actions', async () => {
      const payload = [
        { id: 'READ_1002_DASHBOARD', action: 'ADD' },
        { id: 'READ_1004_VIEW', action: 'ADD' },
      ];
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.UPDATE_PERMISSIONS),
        },
        {
          type: SUCCESS(ACTION_TYPES.UPDATE_PERMISSIONS),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(updateUserPermissions(payload, 'admin')).then(() => expect(store.getActions()).toEqual(expectedActions));
    });
    it('dispatches User Group UPDATE_PERMISSIONS_PENDING and UPDATE_PERMISSIONS_FULFILLED actions', async () => {
      const payload = [
        { id: 'READ_1002_DASHBOARD', action: 'ADD' },
        { id: 'READ_1004_VIEW', action: 'ADD' },
      ];
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.UPDATE_PERMISSIONS),
        },
        {
          type: SUCCESS(ACTION_TYPES.UPDATE_PERMISSIONS),
          payload: resolvedObject,
        },
      ];
      await store
        .dispatch(updateUserGroupPermissions(payload, 'role_test'))
        .then(() => expect(store.getActions()).toEqual(expectedActions));
    });
    it('dispatches ACTION_TYPES.RESET actions', async () => {
      const expectedActions = [
        {
          type: ACTION_TYPES.RESET_VIEWS_PERMISSIONS,
        },
      ];
      await store.dispatch(resetViewsPermissions());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
