import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ICrudPutAction } from 'react-jhipster';
import { IPermission } from 'app/shared/model/permission.model';

export const ACTION_TYPES = {
  FETCH_DASHBOARD_PERMISSIONS: 'permission/FETCH_DASHBOARD_PERMISSIONS',
  FETCH_DATASOURCE_PERMISSIONS: 'permission/FETCH_DATASOURCE_PERMISSIONS',
  FETCH_VIEWS_PERMISSIONS: 'permission/FETCH_VIEWS_PERMISSIONS',
  UPDATE_PERMISSIONS: 'permission/UPDATE_PERMISSIONS',
  RESET_VIEWS_PERMISSIONS: 'permission/RESET_VIEWS_PERMISSIONS',
};

const initialState = {
  loading: false,
  errorMessage: null,
  dashboardPermissions: [],
  totalDashboardPermissions: 0,
  datasourcePermissions: [],
  totalDatasourcePermissions: 0,
  viewsPermissions: [],
  totalViewsPermissions: 0,
  updateSuccess: false,
  updating: false,
  totalDatasourceConstraints: 0,
};

export type PermissionsState = Readonly<typeof initialState>;

// Reducer
export default (state: PermissionsState = initialState, action): PermissionsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS):
    case REQUEST(ACTION_TYPES.FETCH_DATASOURCE_PERMISSIONS):
      return {
        ...state,
        datasourcePermissions: [],
        totalDatasourcePermissions: 0,
      };
    case FAILURE(ACTION_TYPES.FETCH_DATASOURCE_PERMISSIONS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case REQUEST(ACTION_TYPES.FETCH_VIEWS_PERMISSIONS):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_VIEWS_PERMISSIONS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case REQUEST(ACTION_TYPES.UPDATE_PERMISSIONS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.UPDATE_PERMISSIONS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        updateSuccess: false,
        updating: false,
      };

    case SUCCESS(ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS):
      return {
        ...state,
        loading: false,
        dashboardPermissions: action.payload.data,
        totalDashboardPermissions: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_DATASOURCE_PERMISSIONS):
      return {
        ...state,
        loading: false,
        datasourcePermissions: action.payload.data,
        totalDatasourcePermissions: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_VIEWS_PERMISSIONS):
      return {
        ...state,
        loading: false,
        viewsPermissions: action.payload.data,
        totalViewsPermissions: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.UPDATE_PERMISSIONS):
      return {
        ...state,
        loading: false,
        updateSuccess: true,
        updating: false,
      };
    case ACTION_TYPES.RESET_VIEWS_PERMISSIONS:
      return {
        ...state,
        loading: false,
        updateSuccess: false,
        viewsPermissions: [],
        totalViewsPermissions: 0,
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

export const getUserGroupDatasourcePermissions = (page: number, size: number, name: string) => ({
  type: ACTION_TYPES.FETCH_DATASOURCE_PERMISSIONS,
  payload: axios.get(`api/userGroups/${name}/datasourcePermissions?page=${page}&size=${size}`),
});

export const getUserDatasourcePermissions = (page: number, size: number, login: string) => ({
  type: ACTION_TYPES.FETCH_DATASOURCE_PERMISSIONS,
  payload: axios.get(`api/users/${login}/datasourcePermissions?page=${page}&size=${size}`),
});

export const updateGroupPermissions = (permissions: Array<IPermission>, name: string) => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_PERMISSIONS,
    payload: axios.put(`api/userGroups/${name}/changePermissions`, permissions),
  });
  return result;
};
export const getUserGroupViewsPermissions = (page: number, size: number, name: string, id: number) => ({
  type: ACTION_TYPES.FETCH_VIEWS_PERMISSIONS,
  payload: axios.get(`api/userGroups/${name}/dashboardPermissions/${id}/viewPermissions?page=${page}&size=${size}`),
});

export const getUserViewsPermissions = (page: number, size: number, login: string, id: number) => ({
  type: ACTION_TYPES.FETCH_VIEWS_PERMISSIONS,
  payload: axios.get(`api/users/${login}/dashboardPermissions/${id}/viewPermissions?page=${page}&size=${size}`),
});

export const updateUserGroupPermissions = (permissions: Array<IPermission>, name: string) => ({
  type: ACTION_TYPES.UPDATE_PERMISSIONS,
  payload: axios.put(`api/userGroups/${name}/changePermissions`, permissions),
});

export const updateUserPermissions = (permissions: Array<IPermission>, login: string) => ({
  type: ACTION_TYPES.UPDATE_PERMISSIONS,
  payload: axios.put(`api/users/${login}/changePermissions`, permissions),
});

export const resetViewsPermissions = () => ({
  type: ACTION_TYPES.RESET_VIEWS_PERMISSIONS,
});
