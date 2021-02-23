import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IDatasources, defaultValue } from 'app/shared/model/datasources.model';

export const ACTION_TYPES = {
  FETCH_DATASOURCES_LIST: 'datasources/FETCH_DATASOURCES_LIST',
  FETCH_DATASOURCES: 'datasources/FETCH_DATASOURCES',
  CREATE_DATASOURCES: 'datasources/CREATE_DATASOURCES',
  UPDATE_DATASOURCES: 'datasources/UPDATE_DATASOURCES',
  DELETE_DATASOURCES: 'datasources/DELETE_DATASOURCES',
  RESET: 'datasources/RESET',
  TEST_CONNECTION: 'datasources/TEST_CONNECTION',
};

const initialState = {
  loading: false,
  errorMessage: null,
  datasources: [] as ReadonlyArray<IDatasources>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  isConnected: false,
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
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_DATASOURCES):
    case REQUEST(ACTION_TYPES.UPDATE_DATASOURCES):
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
    case FAILURE(ACTION_TYPES.FETCH_DATASOURCES_LIST):
    case FAILURE(ACTION_TYPES.FETCH_DATASOURCES):
    case FAILURE(ACTION_TYPES.CREATE_DATASOURCES):
    case FAILURE(ACTION_TYPES.UPDATE_DATASOURCES):
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
        errorMessage: action.payload,
        isConnected: false,
        loading: false,
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
    case SUCCESS(ACTION_TYPES.UPDATE_DATASOURCES):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
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
    case ACTION_TYPES.RESET:
      return {
        ...state,
        loading: false,
        errorMessage: null,
        entity: defaultValue,
        updating: false,
        updateSuccess: false,
        isConnected: false,
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

export const createEntity: ICrudPutAction<IDatasources> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_DATASOURCES,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IDatasources> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_DATASOURCES,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

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

export const queryToConnection = (connection: any) => ({
  type: ACTION_TYPES.TEST_CONNECTION,
  payload: axios.post('api/query/test', connection),
});
