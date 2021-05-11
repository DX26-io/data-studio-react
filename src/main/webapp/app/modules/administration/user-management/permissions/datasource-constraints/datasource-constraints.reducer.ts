import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ICrudPutAction } from 'react-jhipster';
import { IPermission } from 'app/shared/model/permission.model';

export const ACTION_TYPES = {
  FETCH_USER_DATASOURCE_CONSTRAINTS: 'datasource-constraints/FETCH_USER_DATASOURCE_CONSTRAINTS',
  FETCH_USER_GROUP_DATASOURCE_CONSTRAINTS: 'datasource-constraints/FETCH_USER_GROUP_DATASOURCE_CONSTRAINTS',
  FETCH_DASHBOARD_PERMISSIONS: 'permission/FETCH_DASHBOARD_PERMISSIONS',
  FETCH_DATASOURCE_PERMISSIONS: 'permission/FETCH_DATASOURCE_PERMISSIONS',
  FETCH_VIEWS_PERMISSIONS: 'permission/FETCH_VIEWS_PERMISSIONS',
  UPDATE_PERMISSIONS: 'permission/UPDATE_PERMISSIONS',
  RESET_VIEWS_PERMISSIONS: 'permission/RESET_VIEWS_PERMISSIONS',
};

const initialState = {
  loading: false,
  errorMessage: null,
  constraints: [],
  updateSuccess: false,
  updating: false,
};

export type DatasourceConstraintsState = Readonly<typeof initialState>;

// Reducer
export default (state: DatasourceConstraintsState = initialState, action): DatasourceConstraintsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_USER_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.FETCH_USER_GROUP_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_USER_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case FAILURE(ACTION_TYPES.FETCH_USER_GROUP_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_USER_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        loading: false,
        constraints: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_USER_GROUP_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        loading: false,
        constraints: action.payload.data,
      };
    default:
      return state;
  }
};

export const getUserGroupDatasourceConstraints = (name: string) => ({
  type: ACTION_TYPES.FETCH_USER_GROUP_DATASOURCE_CONSTRAINTS,
  payload: axios.get(`api/datasource-group-constraints?userGroup.name=${name}`),
});

export const getUserDatasourceConstraints = (login: string) => ({
  type: ACTION_TYPES.FETCH_USER_DATASOURCE_CONSTRAINTS,
  payload: axios.get(`api/datasource-constraints?user.login=${login}`),
});

export const reset = () => ({
  type: ACTION_TYPES.RESET_VIEWS_PERMISSIONS,
});
