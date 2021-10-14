import axios from 'axios';

import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import sinon from 'sinon';

import datasources, {
  ACTION_TYPES,
  createDatasource,
  deleteDatasource,
  getDatasources,
  getDatasource,
  updateDatasource,
  reset,
  listTables,
  executeQuery,
  queryToConnection,
} from 'app/modules/administration/sources/datasources/datasources.reducer';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IDatasources, defaultDatasourceValue } from 'app/shared/model/datasources.model';

describe('Entities reducer tests', () => {
  function isEmpty(element): boolean {
    if (element instanceof Array) {
      return element.length === 0;
    } else {
      return Object.keys(element).length === 0;
    }
  }

  const initialState = {
    loading: false,
    errorMessage: null,
    datasources: [] as ReadonlyArray<IDatasources>,
    entity: defaultDatasourceValue,
    updating: false,
    totalItems: 0,
    updateSuccess: false,
    isConnected: false,
    tables: [],
    updateError: null,
    sampleData: [],
    updateFeaturesSuccess: false,
    updateFeaturesRequest: false,
  };

  function testInitialState(state) {
    expect(state).toMatchObject({
      loading: false,
      errorMessage: null,
      entity: defaultDatasourceValue,
      updating: false,
      updateSuccess: false,
      isConnected: false,
      updateError: null,
    });
    expect(isEmpty(state.datasources));
    expect(isEmpty(state.sampleData));
  }

  function testMultipleTypes(types, payload, testFunction) {
    types.forEach(e => {
      testFunction(datasources(undefined, { type: e, payload }));
    });
  }

  describe('Common', () => {
    it('should return the initial state', () => {
      testInitialState(datasources(undefined, {}));
    });
  });

  describe('Requests', () => {
    it('should set state to loading', () => {
      testMultipleTypes([REQUEST(ACTION_TYPES.FETCH_DATASOURCES), REQUEST(ACTION_TYPES.FETCH_DATASOURCE)], {}, state => {
        expect(state).toMatchObject({
          errorMessage: null,
          loading: true,
        });
      });
    });

    it('should set state to updating', () => {
      testMultipleTypes(
        [REQUEST(ACTION_TYPES.CREATE_DATASOURCE), REQUEST(ACTION_TYPES.UPDATE_DATASOURCE), REQUEST(ACTION_TYPES.DELETE_DATASOURCE)],
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

    it('should reset the state', () => {
      expect(
        datasources(
          {
            ...initialState,
            loading: false,
            errorMessage: null,
            entity: defaultDatasourceValue,
            updating: false,
            updateSuccess: false,
            isConnected: false,
            updateError: null,
            updateFeaturesSuccess: false,
            updateFeaturesRequest: false,
          },
          {
            type: ACTION_TYPES.RESET,
          }
        )
      ).toEqual({
        ...initialState,
      });
    });
  });

  describe('Failures', () => {
    it('should set state to failed and put an error message in errorMessage', () => {
      testMultipleTypes(
        [
          FAILURE(ACTION_TYPES.FETCH_DATASOURCES),
          FAILURE(ACTION_TYPES.FETCH_DATASOURCE),
          FAILURE(ACTION_TYPES.CREATE_DATASOURCE),
          FAILURE(ACTION_TYPES.UPDATE_DATASOURCE),
          FAILURE(ACTION_TYPES.DELETE_DATASOURCE),
          FAILURE(ACTION_TYPES.LIST_TABLE),
          FAILURE(ACTION_TYPES.QUERY_EXECUTE),
          FAILURE(ACTION_TYPES.TEST_CONNECTION),
        ],
        'something happened',
        state => {
          expect(state).toMatchObject({
            updateSuccess: false,
            updating: false,
            loading: false,
            errorMessage: 'something happened',
            updateError: null,
          });
        }
      );
    });
  });

  describe('Successes', () => {
    it('should fetch datasources', () => {
      const payload = { data: [{ 1: 'fake1' }, { 2: 'fake2' }], headers: { 'x-total-count': 123 } };
      expect(
        datasources(undefined, {
          type: SUCCESS(ACTION_TYPES.FETCH_DATASOURCES),
          payload,
        })
      ).toEqual({
        ...initialState,
        loading: false,
        totalItems: payload.headers['x-total-count'],
        datasources: payload.data,
      });
    });

    it('should fetch a single datasource', () => {
      const payload = { data: { 1: 'fake1' } };
      expect(
        datasources(undefined, {
          type: SUCCESS(ACTION_TYPES.FETCH_DATASOURCE),
          payload,
        })
      ).toEqual({
        ...initialState,
        loading: false,
        entity: payload.data,
      });
    });

    it('should create/update datasource', () => {
      const payload = { data: 'fake payload' };
      expect(
        datasources(undefined, {
          type: SUCCESS(ACTION_TYPES.CREATE_DATASOURCE),
          payload,
        })
      ).toEqual({
        ...initialState,
        updating: false,
        updateSuccess: true,
        updateError: null,
        entity: payload.data,
      });
    });

    it('should delete datasource', () => {
      const payload = 'fake payload';
      const toTest = datasources(undefined, {
        type: SUCCESS(ACTION_TYPES.DELETE_DATASOURCE),
        payload,
      });
      expect(toTest).toMatchObject({
        updating: false,
        updateSuccess: true,
      });
    });
  });

  describe('Actions', () => {
    let store;

    const resolvedObject = { value: 'whatever' };
    beforeEach(() => {
      const mockStore = configureStore([thunk, promiseMiddleware]);
      store = mockStore({});
      axios.get = sinon.stub().returns(Promise.resolve(resolvedObject));
      axios.post = sinon.stub().returns(Promise.resolve(resolvedObject));
      axios.put = sinon.stub().returns(Promise.resolve(resolvedObject));
      axios.delete = sinon.stub().returns(Promise.resolve(resolvedObject));
    });

    it('dispatches ACTION_TYPES.FETCH_DATASOURCES actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_DATASOURCES),
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_DATASOURCES),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(getDatasources()).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.LIST_TABLE actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.LIST_TABLE),
        },
        {
          type: SUCCESS(ACTION_TYPES.LIST_TABLE),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(listTables({ name: 'test' })).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.QUERY_EXECUTE actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.QUERY_EXECUTE),
        },
        {
          type: SUCCESS(ACTION_TYPES.QUERY_EXECUTE),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(executeQuery({ sql: 'test' })).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.TEST_CONNECTION actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.TEST_CONNECTION),
        },
        {
          type: SUCCESS(ACTION_TYPES.TEST_CONNECTION),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(queryToConnection({ id: 1 })).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.FETCH_DATASOURCE actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_DATASOURCE),
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_DATASOURCE),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(getDatasource(42666)).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.CREATE_DATASOURCE actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.CREATE_DATASOURCE),
        },
        {
          type: SUCCESS(ACTION_TYPES.CREATE_DATASOURCE),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(createDatasource({ id: 1 })).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.UPDATE_DATASOURCE actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.UPDATE_DATASOURCE),
        },
        {
          type: SUCCESS(ACTION_TYPES.UPDATE_DATASOURCE),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(updateDatasource({ id: 1 })).then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('dispatches ACTION_TYPES.DELETE_DATASOURCE actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.DELETE_DATASOURCE),
        },
        {
          type: SUCCESS(ACTION_TYPES.DELETE_DATASOURCE),
          payload: resolvedObject,
        },
        {
          type: REQUEST(ACTION_TYPES.FETCH_DATASOURCES),
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_DATASOURCES),
          payload: resolvedObject,
        },
      ];
      await store.dispatch(deleteDatasource(42666)).then(() => expect(store.getActions()).toEqual(expectedActions));
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
