import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { generateDatasourcesOptions } from '../datasources/steps/datasource-util';
import { IDatasources, defaultDatasourceValue } from 'app/shared/model/datasources.model';
export const ACTION_TYPES = {
  FETCH_DATASOURCES: 'datasources/FETCH_DATASOURCES',
  FETCH_DATASOURCE: 'datasources/FETCH_DATASOURCE',
  CREATE_DATASOURCE: 'datasources/CREATE_DATASOURCE',
  UPDATE_DATASOURCE: 'datasources/UPDATE_DATASOURCE',
  DELETE_DATASOURCE: 'datasources/DELETE_DATASOURCE',
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
    case REQUEST(ACTION_TYPES.FETCH_DATASOURCES):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.FETCH_DATASOURCE):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_DATASOURCE):
      return {
        ...state,
        updateSuccess: false,
        updating: true,
        updateError: null,
      };
    case REQUEST(ACTION_TYPES.UPDATE_DATASOURCE):
      return {
        ...state,
        updateSuccess: false,
        updating: true,
        updateError: null,
      };
    case REQUEST(ACTION_TYPES.DELETE_DATASOURCE):
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
    case FAILURE(ACTION_TYPES.FETCH_DATASOURCES):
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
      };
    case FAILURE(ACTION_TYPES.FETCH_DATASOURCE):
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
      };
    case FAILURE(ACTION_TYPES.CREATE_DATASOURCE):
      return { ...state, updateSuccess: false, errorMessage: action.payload };
    case FAILURE(ACTION_TYPES.UPDATE_DATASOURCE):
      return { ...state, updateSuccess: false, errorMessage: action.payload };
    case FAILURE(ACTION_TYPES.DELETE_DATASOURCE):
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
        errorMessage: action.payload,
        isConnected: false,
        loading: false,
      };
    case FAILURE(ACTION_TYPES.QUERY_EXECUTE):
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
      };
    case FAILURE(ACTION_TYPES.LIST_TABLE):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };

    case SUCCESS(ACTION_TYPES.FETCH_DATASOURCES):
      return {
        ...state,
        loading: false,
        datasources: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_DATASOURCE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_DATASOURCE):
      return {
        ...state,
        entity: action.payload.data,
        updateError: action.payload.data.error ? action.payload.data.error : null,
        updateSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_DATASOURCE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        updateError: action.payload.data.error ? action.payload.data.error : null,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_DATASOURCE):
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

export const getDatasources: ICrudGetAllAction<IDatasources> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_DATASOURCES,
    payload: axios.get<IDatasources>(`${requestUrl}`),
  };
};

export const getDatasourcesByName = (page: number, size: number, sort: string, name?: string) => ({
  type: ACTION_TYPES.FETCH_DATASOURCES,
  payload: axios.get(`${apiUrl}?name=${name}&page=${page}&size=${size}&sort=${sort}`),
});

export const getDatasource: ICrudGetAction<IDatasources> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_DATASOURCE,
    payload: axios.get<IDatasources>(requestUrl),
  };
};

export const createDatasource: ICrudPutAction<IDatasources> = (entity: IDatasources) => ({
  type: ACTION_TYPES.CREATE_DATASOURCE,
  payload: axios.post(apiUrl, { datasource: entity }),
});

export const createDatasourceWithAction = (entity: IDatasources, action: string) => ({
  type: ACTION_TYPES.CREATE_DATASOURCE,
  payload: axios.post(apiUrl, { datasource: entity, action }),
});

export const updateDatasource: ICrudPutAction<IDatasources> = (entity: IDatasources) => ({
  type: ACTION_TYPES.UPDATE_DATASOURCE,
  payload: axios.put(apiUrl, { datasource: entity }),
});

export const deleteDatasource: ICrudDeleteAction<IDatasources> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_DATASOURCE,
    payload: axios.delete(requestUrl),
  });
  dispatch(getDatasources());
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
  payload: axios.post(`${apiUrl}/listTables`, body),
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
