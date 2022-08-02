import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';
import { generateOptions } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IUserGroup, defaultValue } from 'app/shared/model/user-group.model';

export const ACTION_TYPES = {
  FETCH_ROLES: 'userGroups/FETCH_ROLES',
  FETCH_USER_GROUPS: 'userGroups/FETCH_USER_GROUPS',
  FETCH_USER_GROUP: 'userGroups/FETCH_USER_GROUP',
  CREATE_USER_GROUP: 'userGroups/CREATE_USER_GROUP',
  UPDATE_USER_GROUP: 'userGroups/UPDATE_USER_GROUP',
  DELETE_USER_GROUP: 'userGroups/DELETE_USER_GROUP',
  SEARCH_USER_GROUPS: 'userGroups/SEARCH_USER_GROUPS',
  SET_USER_GROUP: 'userGroups/SET_USER_GROUP',
  RESET: 'userGroups/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  groups: [] as ReadonlyArray<IUserGroup>,
  authorities: [] as any[],
  group: defaultValue,
  updating: false,
  updateSuccess: false,
  fetchSuccess: false,
  totalItems: 0,
  searchedGroups: [] as ReadonlyArray<IUserGroup>,
};

export type UserGroupsState = Readonly<typeof initialState>;

// Reducer
export default (state: UserGroupsState = initialState, action): UserGroupsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_ROLES):
      return {
        ...state,
      };
    case REQUEST(ACTION_TYPES.FETCH_USER_GROUPS):
    case REQUEST(ACTION_TYPES.SEARCH_USER_GROUPS):
    case REQUEST(ACTION_TYPES.FETCH_USER_GROUP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_USER_GROUP):
    case REQUEST(ACTION_TYPES.UPDATE_USER_GROUP):
    case REQUEST(ACTION_TYPES.DELETE_USER_GROUP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_USER_GROUPS):
    case FAILURE(ACTION_TYPES.SEARCH_USER_GROUPS):
    case FAILURE(ACTION_TYPES.FETCH_USER_GROUP):
    case FAILURE(ACTION_TYPES.FETCH_ROLES):
    case FAILURE(ACTION_TYPES.CREATE_USER_GROUP):
    case FAILURE(ACTION_TYPES.UPDATE_USER_GROUP):
    case FAILURE(ACTION_TYPES.DELETE_USER_GROUP):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_ROLES):
      return {
        ...state,
        authorities: generateOptions(action.payload.data),
      };
    case SUCCESS(ACTION_TYPES.FETCH_USER_GROUPS):
      return {
        ...state,
        loading: false,
        groups: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.SEARCH_USER_GROUPS):
      return {
        ...state,
        loading: false,
        searchedGroups: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_USER_GROUP):
      return {
        ...state,
        loading: false,
        group: { ...action.payload.data, userGroups: generateOptions(action.payload.data.userGroups) },
        fetchSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.CREATE_USER_GROUP):
      return {
        ...state,
        updateSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_USER_GROUP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        group: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_USER_GROUP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        group: defaultValue,
      };
    case ACTION_TYPES.RESET:
      return {
        ...state,
        group: defaultValue,
        fetchSuccess: false,
        updateSuccess: false,
        updating: false,
      };
    case ACTION_TYPES.SET_USER_GROUP:
      return {
        ...state,
        group: action.payload,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/userGroups';
const searchApiUrl = apiUrl + '/search';
// Actions
export const getUserGroups: ICrudGetAllAction<IUserGroup> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}`;
  return {
    type: ACTION_TYPES.FETCH_USER_GROUPS,
    payload: axios.get<IUserGroup>(requestUrl),
  };
};

// TODO : needs to be moved in user group reducer.
export const getRoles = () => ({
  type: ACTION_TYPES.FETCH_ROLES,
  payload: axios.get(`api/userGroups/all`),
});

export const getUserGroup: ICrudGetAction<IUserGroup> = name => {
  const requestUrl = `${apiUrl}/${name}`;
  return {
    type: ACTION_TYPES.FETCH_USER_GROUP,
    payload: axios.get<IUserGroup>(requestUrl),
  };
};

export const createUserGroup: ICrudPutAction<IUserGroup> = userGroup => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_USER_GROUP,
    payload: axios.post(apiUrl, userGroup),
  });
  return result;
};

export const updateUserGroup: ICrudPutAction<IUserGroup> = userGroup => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_USER_GROUP,
    payload: axios.put(apiUrl, userGroup),
  });
  return result;
};

export const deleteUserGroup: ICrudDeleteAction<IUserGroup> = name => async dispatch => {
  const requestUrl = `${apiUrl}/${name}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_USER_GROUP,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

export const searchUserGroups = (page, size, sort, name) => {
  const requestUrl = `${searchApiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}&name=${name}` : ''}`;
  return {
    type: ACTION_TYPES.SEARCH_USER_GROUPS,
    payload: axios.get<IUserGroup>(requestUrl),
  };
};

export const setUserGroup = (group: IUserGroup) => ({
  type: ACTION_TYPES.SET_USER_GROUP,
  payload: group,
});
