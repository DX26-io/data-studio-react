import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { IConnection, connectionDefaultValue } from 'app/shared/model/connection.model';

import { IConnectionType, defaultConnectionTypeValue } from 'app/shared/model/connection-type.model';

import { onConnectionTypeFetched, setIsSelectedConnectionType } from './connections.util';

export const ACTION_TYPES = {
  FETCH_CONNECTIONS: 'connections/FETCH_CONNECTIONS',
  FETCH_CONNECTIONS_BY_ID: 'connections/FETCH_CONNECTIONS_BY_ID',
  FETCH_CONNECTIONS_TYPES: 'connections/FETCH_CONNECTIONS_TYPES',
  SET_IS_SELECTED_CONNECTION_TYPE: 'connections/SET_IS_SELECTED_CONNECTION_TYPE',
  CREATE_CONNECTION: 'connections/CREATE_CONNECTION',
  UPDATE_CONNECTION: 'connections/UPDATE_CONNECTION',
  DELETE_CONNECTION: 'connections/DELETE_CONNECTION',
  FETCH_META_DATA: 'connections/FETCH_META_DATA',
  RESET: 'connections/RESET',
  SET_CONNECTION: 'connections/SET_CONNECTION',
};

const initialState = {
  loading: false,
  errorMessage: null,
  connections: [] as IConnection[],
  connection: connectionDefaultValue,
  connectionsTypes: [] as IConnectionType[],
  totalItems: 0,
  updateSuccess: false,
  featuresMetaData: null,
  updateError: null,
  updating: false,
  isMetaDataReceived: false,
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
        connections: [connectionDefaultValue, ...action.payload.data],
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
        connectionsTypes: onConnectionTypeFetched(action.payload.data),
      };
    case REQUEST(ACTION_TYPES.UPDATE_CONNECTION):
      return {
        ...state,
        updateError: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.UPDATE_CONNECTION):
      return {
        ...state,
        updateSuccess: false,
        updateError: action.payload.data,
        updating: false,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_CONNECTION):
      return {
        ...state,
        updateSuccess: true,
        connection: action.payload.data,
        updateError: null,
        updating: false,
      };
    case REQUEST(ACTION_TYPES.CREATE_CONNECTION):
      return {
        ...state,
        updateError: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.CREATE_CONNECTION):
      return {
        ...state,
        updateSuccess: false,
        updateError: action.payload.data,
        updating: false,
      };
    case SUCCESS(ACTION_TYPES.CREATE_CONNECTION):
      return {
        ...state,
        updateSuccess: true,
        updateError: null,
        connection: action.payload.data,
        updating: false,
      };
    case REQUEST(ACTION_TYPES.DELETE_CONNECTION):
      return {
        ...state,
        updateSuccess: false,
        errorMessage: null,
      };
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
        errorMessage: null,
      };
    case REQUEST(ACTION_TYPES.FETCH_META_DATA):
      return {
        ...state,
        loading: true,
        isMetaDataReceived: false,
      };
    case FAILURE(ACTION_TYPES.FETCH_META_DATA):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload.data,
        isMetaDataReceived: false,
      };
    case SUCCESS(ACTION_TYPES.FETCH_META_DATA):
      return {
        ...state,
        loading: false,
        featuresMetaData: action.payload.data,
        isMetaDataReceived: true,
      };
    case ACTION_TYPES.SET_IS_SELECTED_CONNECTION_TYPE:
      return {
        ...state,
        connectionsTypes: setIsSelectedConnectionType(state.connectionsTypes, action.payload),
      };
    case ACTION_TYPES.RESET:
      return {
        ...state,
        loading: false,
        errorMessage: null,
        connection: connectionDefaultValue,
        updateSuccess: false,
        updating: false,
        updateError: null,
      };
    case ACTION_TYPES.SET_CONNECTION:
      return {
        ...state,
        connection: action.payload,
      };

    default:
      return state;
  }
};

const apiUrl = 'api/connection';

export const getConnections: ICrudGetAllAction<IConnection> = () => ({
  type: ACTION_TYPES.FETCH_CONNECTIONS,
  payload: axios.get(`${apiUrl}`),
});

export const getConnectionsByConnectionTypeId: ICrudGetAllAction<IConnection> = (connectionTypeId: number) => ({
  type: ACTION_TYPES.FETCH_CONNECTIONS_BY_ID,
  payload: axios.get(`${apiUrl}?connectionType=${connectionTypeId}`),
});

export const getConnectionsTypes: ICrudGetAllAction<IConnectionType> = () => ({
  type: ACTION_TYPES.FETCH_CONNECTIONS_TYPES,
  payload: axios.get('api/connection-type'),
});

export const createConnection: ICrudPutAction<IConnection> = (connection: IConnection) => ({
  type: ACTION_TYPES.CREATE_CONNECTION,
  payload: axios.post(`${apiUrl}`, connection),
});

export const updateConnection: ICrudPutAction<IConnection> = (connection: IConnection) => ({
  type: ACTION_TYPES.UPDATE_CONNECTION,
  payload: axios.put(`${apiUrl}`, connection),
});

export const deleteConnection = (id: string) => ({
  type: ACTION_TYPES.DELETE_CONNECTION,
  payload: axios.delete(`${apiUrl}/${id}`),
});

export const resetConnection = () => ({
  type: ACTION_TYPES.RESET,
});

export const updateIsSelectedConnectionType = (id: number) => ({
  type: ACTION_TYPES.SET_IS_SELECTED_CONNECTION_TYPE,
  payload: id,
});

export const getFeatures = (datasourceId: number, body: any) => ({
  type: ACTION_TYPES.FETCH_META_DATA,
  payload: axios.post(`${apiUrl}/features/${datasourceId}?cacheBuster=${new Date().getTime()}`, body),
});

export const setConnection = (connection: IConnection) => {
  return {
    type: ACTION_TYPES.SET_CONNECTION,
    payload: connection,
  };
};
