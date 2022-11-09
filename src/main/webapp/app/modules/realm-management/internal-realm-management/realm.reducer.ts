import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IRealm } from 'app/shared/model/realm.model';
import { ICrudSearchAction } from 'react-jhipster/src/type/redux-action.type';

export const ACTION_TYPES = {
  FETCH_ROLES: 'realms/FETCH_ROLES',
  FETCH_REALMS: 'realms/FETCH_REALMS',
  FETCH_REALM: 'realms/FETCH_REALM',
  CREATE_REALM: 'realms/CREATE_REALM',
  UPDATE_REALM: 'realms/UPDATE_REALM',
  DELETE_REALM: 'realms/DELETE_REALM',
  SET_REALM: 'realms/SET_REALM',
  UPDATE_REALM_STATUS: 'realms/UPDATE_REALM_STATUS',
  RESET: 'realms/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  realms: [] as ReadonlyArray<IRealm>,
  updating: false,
  updateSuccess: false,
  fetchSuccess: false,
  totalItems: 0,
  searchedGroups: [] as ReadonlyArray<IRealm>,
  realm: null,
};

export type InternalRealmsState = Readonly<typeof initialState>;

// Reducer
export default (state: InternalRealmsState = initialState, action): InternalRealmsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_ROLES):
      return {
        ...state,
      };
    case REQUEST(ACTION_TYPES.FETCH_REALMS):
    case REQUEST(ACTION_TYPES.FETCH_REALM):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_REALM):
    case REQUEST(ACTION_TYPES.UPDATE_REALM):
      return {
        ...state,
        updating: true,
        updateSuccess: false,
      };
    case REQUEST(ACTION_TYPES.UPDATE_REALM_STATUS):
      return {
        ...state,
        updating: true,
        updateSuccess: false,
      };
    case REQUEST(ACTION_TYPES.DELETE_REALM):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_REALMS):
    case FAILURE(ACTION_TYPES.FETCH_REALM):
    case FAILURE(ACTION_TYPES.CREATE_REALM):
    case FAILURE(ACTION_TYPES.UPDATE_REALM):
      return {
        ...state,
        updating: false,
        updateSuccess: false,
      };
    case FAILURE(ACTION_TYPES.UPDATE_REALM_STATUS):
      return {
        ...state,
        updating: false,
        updateSuccess: false,
      };
    case FAILURE(ACTION_TYPES.DELETE_REALM):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_REALMS):
      return {
        ...state,
        loading: false,
        realms: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.CREATE_REALM):
      return {
        ...state,
        updateSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_REALM):
      return {
        ...state,
        updating: false,
        updateSuccess: false,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_REALM_STATUS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
      };
    case ACTION_TYPES.SET_REALM:
      return {
        ...state,
        realm: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...state,
        fetchSuccess: false,
        updateSuccess: false,
        updating: false,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/internal-realms';

// Actions
export const getRealms = (page, size, sort, realmName, organisationName, organisationId) => {
  let requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  if (realmName) {
    requestUrl = `${apiUrl}${sort ? `?name=${realmName}&page=${page}&size=${size}&sort=${sort}` : ''}`;
  } else if (organisationName) {
    requestUrl = `${apiUrl}${sort ? `?realmOrganisation.name=${organisationName}&page=${page}&size=${size}&sort=${sort}` : ''}`;
  } else if (organisationId) {
    requestUrl = `${apiUrl}${sort ? `?realmOrganisation.id=${organisationId}&page=${page}&size=${size}&sort=${sort}` : ''}`;
  }
  return {
    type: ACTION_TYPES.FETCH_REALMS,
    payload: axios.get<IRealm>(requestUrl),
  };
};

export const getRealm: ICrudGetAction<IRealm> = name => {
  const requestUrl = `${apiUrl}/${name}`;
  return {
    type: ACTION_TYPES.FETCH_REALM,
    payload: axios.get<IRealm>(requestUrl),
  };
};

export const createRealm: ICrudPutAction<IRealm> = realm => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_REALM,
    payload: axios.post(apiUrl, realm),
  });
  return result;
};

export const updateRealm: ICrudPutAction<IRealm> = realm => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_REALM,
    payload: axios.put(apiUrl, realm),
  });
  return result;
};

export const deleteRealm: ICrudDeleteAction<IRealm> = name => async dispatch => {
  const requestUrl = `${apiUrl}/${name}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_REALM,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

export const setRealm = (realm: IRealm) => ({
  type: ACTION_TYPES.SET_REALM,
  payload: realm,
});

export const updateStatus = (isActive, id) => ({
  type: ACTION_TYPES.UPDATE_REALM_STATUS,
  payload: axios.put(`${apiUrl}?isActive=${isActive}&id=${id}`),
});
