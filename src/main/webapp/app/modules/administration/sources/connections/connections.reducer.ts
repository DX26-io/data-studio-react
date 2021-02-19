import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { generateOptions } from 'app/shared/util/entity-utils';

export const ACTION_TYPES = {
  FETCH_CONNECTIONS: 'connections/FETCH_CONNECTIONS',
  FETCH_CONNECTIONS_BY_ID: 'connections/FETCH_CONNECTIONS_BY_ID',
  FETCH_CONNECTIONS_TYPES: 'connections/FETCH_CONNECTIONS_TYPES',
};

const initialState = {
  loading: false,
  errorMessage: null,
  connections: [] as any[],
  connectionsTypes: [] as any[],
  totalItems: 0,
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
