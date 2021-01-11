import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ICrudPutAction } from 'react-jhipster';
import { IPermission } from 'app/shared/model/permission.model';

export const ACTION_TYPES = {
  FETCH_DASHBOARD_PERMISSIONS: 'permission/FETCH_DASHBOARD_PERMISSIONS',
  UPDATE_PERMISSIONS: 'permission/UPDATE_PERMISSIONS',
};

const initialState = {
  loading: false,
  errorMessage: null,
  dashboardPermissions: [],
  totalDashboardPermissions: 0,
  updateSuccess: false,
};

export type PermissionsState = Readonly<typeof initialState>;

// Reducer
export default (state: PermissionsState = initialState, action): PermissionsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS):
    case FAILURE(ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case REQUEST(ACTION_TYPES.UPDATE_PERMISSIONS):
    case FAILURE(ACTION_TYPES.UPDATE_PERMISSIONS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };

    case SUCCESS(ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS):
      return {
        ...state,
        loading: false,
        dashboardPermissions: action.payload.data,
        totalDashboardPermissions: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.UPDATE_PERMISSIONS):
      return {
        ...state,
        loading: false,
        updateSuccess: true,
      };
    default:
      return state;
  }
};

export const getUserGroupDashboardPermissions = (page: number, size: number, name: string) => ({
  type: ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS,
  payload: axios.get(`api/userGroups/${name}/dashboardPermissions?page=${page}&size=${size}`),
});

export const getUserDashboardPermissions = (page: number, size: number, login: string) => ({
  type: ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS,
  payload: axios.get(`api/users/${login}/dashboardPermissions?page=${page}&size=${size}`),
});

export const updateGroupPermissions = (permissions: Array<IPermission>, name: string) => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PERMISSIONS,
    payload: axios.put(`api/userGroups/${name}/changePermissions`, permissions),
  });
  return result;
};

export const updateUserPermissions = (permissions: Array<IPermission>, login: string) => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PERMISSIONS,
    payload: axios.put(`api/users/${login}/changePermissions`, permissions),
  });
  return result;
};
