import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IUser, defaultValue } from 'app/shared/model/user.model';

export const ACTION_TYPES = {
  FETCH_CONNECTIONS: 'connections/FETCH_CONNECTIONS',
};

const initialState = {
  loading: false,
  errorMessage: null,
  connections: [] as any[],
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
    default:
      return state;
  }
};

const apiUrl = 'api/connection';

export const getConnections = () => ({
  type: ACTION_TYPES.FETCH_CONNECTIONS,
  payload: axios.get('api/connection'),
});
