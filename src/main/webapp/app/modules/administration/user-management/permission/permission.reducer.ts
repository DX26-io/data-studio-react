import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  FETCH_DASHBOARD_PERMISSIONS: 'permission/FETCH_DASHBOARD_PERMISSIONS',
};

const initialState = {
  loading: false,
  errorMessage: null,
  dashboardPermissions: [],
  totalDashboardPermissions: 0,
};

export type PermissionState = Readonly<typeof initialState>;

// Reducer
export default (state: PermissionState = initialState, action): PermissionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS):
    case FAILURE(ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS):
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
    default:
      return state;
  }
};

export const getUserGroupDashboardPermissions = (page, size, name) => ({
  type: ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS,
  payload: axios.get(`api/userGroups/${name}/dashboardPermissions?page=${page}&size=${size}`),
});

export const getUserDashboardPermissions = (page, size, login) => ({
  type: ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS,
  payload: axios.get(`api/users/${login}/dashboardPermissions?page=${page}&size=${size}`),
});
