import axios from 'axios';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { IConnection, connectionDefaultValue } from 'app/shared/model/connection.model';

import { onFeaturesFetched } from './connections.util';

export const ACTION_TYPES = {
  FETCH_CONNECTIONS: 'connections/FETCH_CONNECTIONS',
  FETCH_CONNECTIONS_BY_ID: 'connections/FETCH_CONNECTIONS_BY_ID',
  FETCH_CONNECTIONS_TYPES: 'connections/FETCH_CONNECTIONS_TYPES',
  CREATE_CONNECTION: 'connections/CREATE_CONNECTION',
  UPDATE_CONNECTION: 'connections/UPDATE_CONNECTION',
  DELETE_CONNECTION: 'connections/DELETE_CONNECTION',
  FETCH_FEATURES: 'connections/FETCH_FEATURES',
  CREATE_FEATURES: 'connections/CREATE_FEATURES',
  RESET: 'connections/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  connections: [] as any[],
  connectionsTypes: [] as any[],
  totalItems: 0,
  updateSuccess: false,
  connection: null,
  features: [],
  updateError: null,
  updatedFeatures: false,
  updatedFeaturesRequest: false,
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
        connectionsTypes: action.payload.data,
      };
    case REQUEST(ACTION_TYPES.UPDATE_CONNECTION):
      return {
        ...state,
        updateError: null,
        updateSuccess: false,
      };
    case FAILURE(ACTION_TYPES.UPDATE_CONNECTION):
      return {
        ...state,
        updateSuccess: false,
        updateError: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_CONNECTION):
      return {
        ...state,
        updateSuccess: true,
        connection: action.payload.data,
        updateError: null,
      };
    case REQUEST(ACTION_TYPES.CREATE_CONNECTION):
      return {
        ...state,
        updateError: null,
        updateSuccess: false,
      };
    case FAILURE(ACTION_TYPES.CREATE_CONNECTION):
      return {
        ...state,
        updateSuccess: false,
        updateError: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_CONNECTION):
      return {
        ...state,
        updateSuccess: true,
        updateError: null,
        connection: action.payload.data,
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
    case REQUEST(ACTION_TYPES.FETCH_FEATURES):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_FEATURES):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_FEATURES):
      return {
        ...state,
        loading: false,
        features: onFeaturesFetched(action.payload.data),
      };
    case REQUEST(ACTION_TYPES.CREATE_FEATURES):
      return {
        ...state,
        updatedFeatures: false,
        updatedFeaturesRequest: true,
      };
    case FAILURE(ACTION_TYPES.CREATE_FEATURES):
      return {
        ...state,
        errorMessage: action.payload.data,
        updatedFeatures: false,
        updatedFeaturesRequest: false,
      };
    case SUCCESS(ACTION_TYPES.CREATE_FEATURES):
      return {
        ...state,
        updatedFeatures: true,
        updatedFeaturesRequest: false,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
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

export const getConnectionsTypes = () => ({
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

export const getFeatures = (datasourceId: number, body: any) => ({
  type: ACTION_TYPES.FETCH_FEATURES,
  payload: axios.post(`${apiUrl}/features/${datasourceId}`, body),
});

// TODO: this needs to be moved in features reducer

export const addFeatures = (featureList: any) => ({
  type: ACTION_TYPES.CREATE_FEATURES,
  payload: axios.post(`api/features/list`, featureList),
});
