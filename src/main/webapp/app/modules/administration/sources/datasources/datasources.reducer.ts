import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { generateDatasourcesOptions } from '../datasources/steps/datasource-util';
import { IDatasources, defaultDatasourceValue } from 'app/shared/model/datasources.model';
import { IConnection } from 'app/shared/model/connection.model';
export const ACTION_TYPES = {
  FETCH_DATASOURCES_LIST: 'datasources/FETCH_DATASOURCES_LIST',
  FETCH_DATASOURCES: 'datasources/FETCH_DATASOURCES',
  CREATE_DATASOURCES: 'datasources/CREATE_DATASOURCES',
  UPDATE_DATASOURCES: 'datasources/UPDATE_DATASOURCES',
  DELETE_DATASOURCES: 'datasources/DELETE_DATASOURCES',
  RESET: 'datasources/RESET',
  TEST_CONNECTION: 'datasources/TEST_CONNECTION',
  QUERY_EXECUTE: 'datasources/QUERY_EXECUTE',
  LIST_TABLE: 'datasources/LIST_TABLE',
  UPDATE_CONNECTION: 'datasources/UPDATE_CONNECTION',
  SET_IS_CONNECTED: 'datasources/SET_IS_CONNECTED',
  RESET_UPDATE_ERROR: 'datasources/RESET_UPDATE_ERROR',
};

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
};

export type DatasourcesState = Readonly<typeof initialState>;

// Reducer

export default (state: DatasourcesState = initialState, action): DatasourcesState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_DATASOURCES_LIST):
    case REQUEST(ACTION_TYPES.FETCH_DATASOURCES):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_DATASOURCES):
      return {
        ...state,
        updateSuccess: false,
        updating: true,
        updateError: null,
      };
    case REQUEST(ACTION_TYPES.UPDATE_DATASOURCES):
      return {
        ...state,
        updateSuccess: false,
        updating: true,
        updateError: null,
      };
    case REQUEST(ACTION_TYPES.DELETE_DATASOURCES):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case REQUEST(ACTION_TYPES.TEST_CONNECTION):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.QUERY_EXECUTE):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.LIST_TABLE):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_DATASOURCES_LIST):
    case FAILURE(ACTION_TYPES.FETCH_DATASOURCES):
    case FAILURE(ACTION_TYPES.CREATE_DATASOURCES):
      return { ...state, updateSuccess: false, errorMessage: action.payload.data };
    case FAILURE(ACTION_TYPES.UPDATE_DATASOURCES):
      return { ...state, updateSuccess: false, errorMessage: action.payload.data };
    case FAILURE(ACTION_TYPES.DELETE_DATASOURCES):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case FAILURE(ACTION_TYPES.TEST_CONNECTION):
      return {
        ...state,
        errorMessage: action.payload.data,
        isConnected: false,
        loading: false,
      };
    case FAILURE(ACTION_TYPES.QUERY_EXECUTE):
      return {
        ...state,
        errorMessage: action.payload.data,
        loading: false,
      };
    case FAILURE(ACTION_TYPES.LIST_TABLE):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };

    case SUCCESS(ACTION_TYPES.FETCH_DATASOURCES_LIST):
      return {
        ...state,
        loading: false,
        datasources: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_DATASOURCES):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_DATASOURCES):
      return {
        ...state,
        entity: action.payload.data,
        updateError: action.payload.data.error ? action.payload.data.error : null,
        updateSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_DATASOURCES):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        updateError: action.payload.data.error ? action.payload.data.error : null,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_DATASOURCES):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case SUCCESS(ACTION_TYPES.TEST_CONNECTION):
      return {
        ...state,
        isConnected: true,
        loading: false,
        errorMessage: null,
      };
    case SUCCESS(ACTION_TYPES.QUERY_EXECUTE):
      return {
        ...state,
        loading: false,
        sampleData: action.payload.data.data,
        errorMessage: null,
      };
    case SUCCESS(ACTION_TYPES.LIST_TABLE):
      return {
        ...state,
        loading: false,
        tables: generateDatasourcesOptions(action.payload.data.tables),
      };
    case ACTION_TYPES.RESET:
      return {
        ...state,
        loading: false,
        errorMessage: null,
        entity: defaultDatasourceValue,
        updating: false,
        updateSuccess: false,
        isConnected: false,
        updateError: null,
      };
    case ACTION_TYPES.SET_IS_CONNECTED:
      return {
        ...state,
        isConnected: action.payload,
      };
    case ACTION_TYPES.RESET_UPDATE_ERROR:
      return {
        ...state,
        updateError: null,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/datasources';

// Actions

export const getEntities: ICrudGetAllAction<IDatasources> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_DATASOURCES_LIST,
    payload: axios.get<IDatasources>(`${requestUrl}`),
  };
};

export const getEntity: ICrudGetAction<IDatasources> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_DATASOURCES,
    payload: axios.get<IDatasources>(requestUrl),
  };
};

export const createDatasource: ICrudPutAction<IDatasources> = (entity: IDatasources) => ({
  type: ACTION_TYPES.CREATE_DATASOURCES,
  payload: axios.post(apiUrl, { datasource: entity }),
});

export const createDatasourceWithAction = (entity: IDatasources, action: string) => ({
  type: ACTION_TYPES.CREATE_DATASOURCES,
  payload: axios.post(apiUrl, { datasource: entity, action }),
});

export const updateEntity: ICrudPutAction<IDatasources> = (entity: IDatasources) => ({
  type: ACTION_TYPES.UPDATE_CONNECTION,
  payload: axios.put(apiUrl, entity),
});

export const deleteEntity: ICrudDeleteAction<IDatasources> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_DATASOURCES,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

export const resetUpdateError = () => ({
  type: ACTION_TYPES.RESET_UPDATE_ERROR,
});

export const listTables = (body: any) => ({
  type: ACTION_TYPES.LIST_TABLE,
  payload: axios.post('api/datasources/listTables', body),
});

export const setIsConnected = (isConnected: boolean) => ({
  type: ACTION_TYPES.SET_IS_CONNECTED,
  payload: isConnected,
});

// TODO : Need to move below services to connection reducer

export const queryToConnection = (connection: any) => ({
  type: ACTION_TYPES.TEST_CONNECTION,
  payload: axios.post('api/query/test', connection),
});

export const executeQuery = (body: any) => ({
  type: ACTION_TYPES.QUERY_EXECUTE,
  payload: axios.post('api/query/execute', body),
});
