import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { IConnection, defaultValue } from 'app/shared/model/connection.model';

export const ACTION_TYPES = {
  FETCH_CONNECTIONS: 'connections/FETCH_CONNECTIONS',
  FETCH_CONNECTIONS_BY_ID: 'connections/FETCH_CONNECTIONS_BY_ID',
  FETCH_CONNECTIONS_TYPES: 'connections/FETCH_CONNECTIONS_TYPES',
  CREATE_CONNECTION: 'connections/CREATE_CONNECTION',
  UPDATE_CONNECTION: 'connections/UPDATE_CONNECTION',
  DELETE_CONNECTION: 'connections/DELETE_CONNECTION',
};

const initialState = {
  loading: false,
  errorMessage: null,
  connections: [] as any[],
  connectionsTypes: [] as any[],
  totalItems: 0,
  updateSuccess: false,
  connection: null,
};

export type ConnectionsState = Readonly<typeof initialState>;

// Reducer
export default (state: ConnectionsState = initialState, action): ConnectionsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CONNECTIONS):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_CONNECTIONS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_CONNECTIONS):
      return {
        ...state,
        loading: false,
        connections: action.payload.data,
      };
    case REQUEST(ACTION_TYPES.FETCH_CONNECTIONS_BY_ID):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_CONNECTIONS_BY_ID):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_CONNECTIONS_BY_ID):
      return {
        ...state,
        loading: false,
        connections: action.payload.data,
      };
    case REQUEST(ACTION_TYPES.FETCH_CONNECTIONS_TYPES):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_CONNECTIONS_TYPES):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_CONNECTIONS_TYPES):
      return {
        ...state,
        loading: false,
        connectionsTypes: action.payload.data,
      };
    case REQUEST(ACTION_TYPES.UPDATE_CONNECTION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
      };
    case FAILURE(ACTION_TYPES.UPDATE_CONNECTION):
      return {
        ...state,
        updateSuccess: false,
        errorMessage: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_CONNECTION):
      return {
        ...state,
        updateSuccess: true,
        connection: action.payload.data,
        errorMessage: null,
      };
    case REQUEST(ACTION_TYPES.CREATE_CONNECTION):
    case FAILURE(ACTION_TYPES.CREATE_CONNECTION):
      return {
        ...state,
        updateSuccess: false,
        errorMessage: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_CONNECTION):
      return {
        ...state,
        updateSuccess: true,
        connection: action.payload.data,
      };
    case REQUEST(ACTION_TYPES.DELETE_CONNECTION):
    case FAILURE(ACTION_TYPES.DELETE_CONNECTION):
      return {
        ...state,
        updateSuccess: false,
        errorMessage: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_CONNECTION):
      return {
        ...state,
        updateSuccess: true,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/connection';

export const getConnections = () => ({
  type: ACTION_TYPES.FETCH_CONNECTIONS,
  payload: axios.get(`${apiUrl}`),
});

export const getConnectionsByConnectionTypeId = (connectionTypeId: number) => ({
  type: ACTION_TYPES.FETCH_CONNECTIONS_BY_ID,
  payload: axios.get(`${apiUrl}?connectionType=${connectionTypeId}`),
});

export const getConnectionsTypes = () => ({
  type: ACTION_TYPES.FETCH_CONNECTIONS_TYPES,
  payload: axios.get('api/connection-type'),
});

export const createConnection = (connection: any) => ({
  type: ACTION_TYPES.CREATE_CONNECTION,
  payload: axios.post(`${apiUrl}`, connection),
});

export const updateConnection = (connection: any) => ({
  type: ACTION_TYPES.UPDATE_CONNECTION,
  payload: axios.put(`${apiUrl}`, connection),
});

export const deleteConnection = (id: string) => ({
  type: ACTION_TYPES.DELETE_CONNECTION,
  payload: axios.delete(`${apiUrl}/${id}`),
});
