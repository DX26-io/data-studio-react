import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import axios from 'axios';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import userManagement, {
  ACTION_TYPES,
  getUserGroups,
  getUserGroup,
  createUserGroup,
  updateUserGroup,
  deleteUserGroup,
  reset,
} from 'app/modules/administration/user-management/groups/user-group.reducer';
import { defaultValue } from 'app/shared/model/user-group.model';

describe('UserGroup management reducer tests', () => {
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
      updating: false,
      updateSuccess: false,
      totalItems: 0,
    });
    expect(isEmpty(state.groups));
    expect(isEmpty(state.authorities));
    expect(isEmpty(state.group));
  }

  function testMultipleTypes(types, payload, testFunction) {
    types.forEach(e => {
      testFunction(userManagement(undefined, { type: e, payload }));
    });
  }

  describe('Common', () => {
    it('should return the initial state', () => {
      testInitialState(userManagement(undefined, {}));
    });
  });

  describe('Requests', () => {
    it('should set state to loading', () => {
      testMultipleTypes([REQUEST(ACTION_TYPES.FETCH_USER_GROUPS), REQUEST(ACTION_TYPES.FETCH_USER_GROUP)], {}, state => {
        expect(state).toMatchObject({
          errorMessage: null,
          updateSuccess: false,
          loading: true,
        });
      });
    });

    it('should set state to updating', () => {
      testMultipleTypes(
        [REQUEST(ACTION_TYPES.CREATE_USER_GROUP), REQUEST(ACTION_TYPES.UPDATE_USER_GROUP), REQUEST(ACTION_TYPES.DELETE_USER_GROUP)],
        {},
        state => {
          expect(state).toMatchObject({
            errorMessage: null,
            updateSuccess: false,
            updating: true,
          });
        }
      );
    });
  });

  describe('Failures', () => {
    it('should set state to failed and put an error message in errorMessage', () => {
      testMultipleTypes(
        [
          FAILURE(ACTION_TYPES.FETCH_USER_GROUPS),
          FAILURE(ACTION_TYPES.FETCH_USER_GROUP),
          FAILURE(ACTION_TYPES.CREATE_USER_GROUP),
          FAILURE(ACTION_TYPES.UPDATE_USER_GROUP),
          FAILURE(ACTION_TYPES.DELETE_USER_GROUP),
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
    it('should update state according to a successful fetch users request', () => {
      const headers = { ['x-total-count']: 42 };
      const payload = { data: 'some handsome users', headers };
      const toTest = userManagement(undefined, { type: SUCCESS(ACTION_TYPES.FETCH_USER_GROUPS), payload });

      expect(toTest).toMatchObject({
        loading: false,
        groups: payload.data,
        totalItems: headers['x-total-count'],
      });
    });

    it('should update state according to a successful fetch user request', () => {
      const payload = {
        data: {
          id: '',
          name: '',
        },
      };
      const toTest = userManagement(undefined, { type: SUCCESS(ACTION_TYPES.FETCH_USER_GROUP), payload });

      expect(toTest).toMatchObject({
        loading: false,
        group: payload.data,
        fetchSuccess: true,
      });
    });

    it('should set state to successful update', () => {
      const payload = {
        data: {
          id: '',
          name: '',
        },
      };
      testMultipleTypes([SUCCESS(ACTION_TYPES.CREATE_USER_GROUP), SUCCESS(ACTION_TYPES.UPDATE_USER_GROUP)], payload, types => {
        expect(types).toMatchObject({
          updating: false,
          updateSuccess: true,
          group: payload.data,
        });
      });
    });

    it('should set state to successful update with an empty user', () => {
      const toTest = userManagement(undefined, { type: SUCCESS(ACTION_TYPES.DELETE_USER_GROUP) });

      expect(toTest).toMatchObject({
        updating: false,
        updateSuccess: true,
      });
      expect(isEmpty(toTest.group));
    });
  });

  describe('Reset', () => {
    it('should reset the state', () => {
      const initialState = {
        loading: false,
        errorMessage: null,
        groups: [],
        authorities: [] as any[],
        group: defaultValue,
        updating: false,
        updateSuccess: false,
        fetchSuccess: false,
        totalItems: 0,
      };
      const payload = {
        ...initialState,
        group: defaultValue,
        fetchSuccess: false,
        updateSuccess: false,
        updating: false,
      };
      expect(
        userManagement(payload, {
          type: ACTION_TYPES.RESET,
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
      axios.post = sinon.stub().returns(Promise.resolve(resolvedObject));
      axios.delete = sinon.stub().returns(Promise.resolve(resolvedObject));
    });

    it('dispatches FETCH_USER_GROUPS_PENDING and FETCH_USER_GROUPS_FULFILLED actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_USER_GROUPS),
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_USER_GROUPS),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(getUserGroups()).then(() => expect(store.getActions()).toEqual(expectedActions));
    });
    it('dispatches FETCH_USER_GROUPS_PENDING and FETCH_USER_GROUPS_FULFILLED actions with pagination options', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_USER_GROUPS),
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_USER_GROUPS),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(getUserGroups(1, 20, 'id,desc')).then(() => expect(store.getActions()).toEqual(expectedActions));
    });
    it('dispatches FETCH_USER_GROUP_PENDING and FETCH_USER_GROUP_FULFILLED actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_USER_GROUP),
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_USER_GROUP),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(getUserGroup(username)).then(() => expect(store.getActions()).toEqual(expectedActions));
    });
    it('dispatches CREATE_USER_GROUP_PENDING and CREATE_USER_GROUP_FULFILLED actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.CREATE_USER_GROUP),
        },
        {
          type: SUCCESS(ACTION_TYPES.CREATE_USER_GROUP),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(createUserGroup()).then(() => expect(store.getActions()).toEqual(expectedActions));
    });
    it('dispatches UPDATE_USER_GROUP_PENDING and UPDATE_USER_GROUP_FULFILLED actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.UPDATE_USER_GROUP),
        },
        {
          type: SUCCESS(ACTION_TYPES.UPDATE_USER_GROUP),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(updateUserGroup({ name: username })).then(() => expect(store.getActions()).toEqual(expectedActions));
    });
    it('dispatches DELETE_USER_GROUP_PENDING and DELETE_USER_GROUP_FULFILLED actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.DELETE_USER_GROUP),
        },
        {
          type: SUCCESS(ACTION_TYPES.DELETE_USER_GROUP),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(deleteUserGroup(username)).then(() => expect(store.getActions()).toEqual(expectedActions));
    });
    it('dispatches ACTION_TYPES.RESET actions', async () => {
      const expectedActions = [
        {
          type: ACTION_TYPES.RESET,
        },
      ];
      await store.dispatch(reset());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
