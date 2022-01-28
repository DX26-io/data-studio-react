import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ICrudPutAction, ICrudDeleteAction, ICrudGetAction } from 'react-jhipster';
import { IUserGroupDatasourceConstraints, defaultValue } from 'app/shared/model/user-group-datasource-constraints.model';
import { defaultValue as conditionDefaultValue, IUserGroupFeatureConstraint } from 'app/shared/model/user-group-feature-constraint.model';
import { onFetchDatasourceConstraints } from './user-group-datasource-constraints.util';
import {removeConstraintFromList,resetConstraint,updateConditionInConstraint,addConstraintIntoList } from '../../permissions-util';
export const ACTION_TYPES = {
  FETCH_USER_GROUP_DATASOURCE_CONSTRAINTS: 'user-group-datasource-constraints/FETCH_USER_GROUP_DATASOURCE_CONSTRAINTS',
  FETCH_DATASOURCE_CONSTRAINTS: 'user-group-datasource-constraints/FETCH_DATASOURCE_CONSTRAINTS',
  SET_DATASOURCE_CONSTRAINTS: 'user-group-datasource-constraints/SET_DATASOURCE_CONSTRAINTS',
  CREATE_DATASOURCE_CONSTRAINTS: 'user-group-datasource-constraints/CREATE_DATASOURCE_CONSTRAINTS',
  UPDATE_DATASOURCE_CONSTRAINTS: 'user-group-datasource-constraints/UPDATE_DATASOURCE_CONSTRAINTS',
  DELETE_DATASOURCE_CONSTRAINTS: 'user-group-datasource-constraints/DELETE_DATASOURCE_CONSTRAINTS',
  ADD_CONSTRAINT: 'user-group-datasource-constraints/ADD_CONSTRAINT',
  UPDATE_CONDITION: 'user-group-datasource-constraints/UPDATE_CONDITION',
  REMOVE_CONSTRAINT: 'user-group-datasource-constraints/REMOVE_CONSTRAINT',
  RESET: 'user-group-datasource-constraints/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  constraints: [],
  updateSuccess: false,
  updating: false,
  features: [],
  constraint: defaultValue,
};

export type UserGroupDatasourceConstraintsState = Readonly<typeof initialState>;

// Reducer
export default (state: UserGroupDatasourceConstraintsState = initialState, action): UserGroupDatasourceConstraintsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_USER_GROUP_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.FETCH_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        errorMessage: null,
        updating: true,
        updateSuccess: false,
      };

    case REQUEST(ACTION_TYPES.UPDATE_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        errorMessage: null,
        updating: true,
        updateSuccess: false,
      };
    case REQUEST(ACTION_TYPES.DELETE_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        errorMessage: null,
        updating: true,
        updateSuccess: false,
      };
    case FAILURE(ACTION_TYPES.FETCH_USER_GROUP_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case FAILURE(ACTION_TYPES.FETCH_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case FAILURE(ACTION_TYPES.CREATE_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case FAILURE(ACTION_TYPES.UPDATE_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case FAILURE(ACTION_TYPES.DELETE_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_USER_GROUP_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        loading: false,
        constraints: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        loading: false,
        constraint: onFetchDatasourceConstraints(action.payload.data),
      };
    case SUCCESS(ACTION_TYPES.CREATE_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        constraint: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        constraint: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
      };
    case ACTION_TYPES.SET_DATASOURCE_CONSTRAINTS:
      return {
        ...state,
        constraint: Object.assign({}, action.payload),
      };
    case ACTION_TYPES.ADD_CONSTRAINT:
      return {
        ...state,
        constraint: addConstraintIntoList(state.constraint,conditionDefaultValue),
      };
    case ACTION_TYPES.UPDATE_CONDITION:
      return {
        ...state,
        constraint: updateConditionInConstraint(state.constraint,action.payload),
      };
    case ACTION_TYPES.REMOVE_CONSTRAINT:
      return {
        ...state,
        constraint: removeConstraintFromList(state.constraint, action.payload),
      };
    case ACTION_TYPES.RESET:
      return {
        ...state,
        constraint: resetConstraint(defaultValue, { '@type': '', id: '' }),
        updateSuccess: false,
        errorMessage: null,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/datasource-group-constraints';

export const getUserGroupDatasourceConstraints = (name: string) => ({
  type: ACTION_TYPES.FETCH_USER_GROUP_DATASOURCE_CONSTRAINTS,
  payload: axios.get(`${apiUrl}?userGroup.name=${name}`),
});

export const getDatasourceConstraints: ICrudGetAction<IUserGroupDatasourceConstraints> = (id: number) => ({
  type: ACTION_TYPES.FETCH_DATASOURCE_CONSTRAINTS,
  payload: axios.get(`${apiUrl}/${id}`),
});

export const createDatasourceConstraints: ICrudPutAction<IUserGroupDatasourceConstraints> = entity => ({
  type: ACTION_TYPES.CREATE_DATASOURCE_CONSTRAINTS,
  payload: axios.post(`${apiUrl}`, entity),
});

export const updateDatasourceConstraints: ICrudPutAction<IUserGroupDatasourceConstraints> = entity => ({
  type: ACTION_TYPES.CREATE_DATASOURCE_CONSTRAINTS,
  payload: axios.put(`${apiUrl}`, entity),
});

export const deleteDatasourceConstraints: ICrudDeleteAction<IUserGroupDatasourceConstraints> = (id: number) => ({
  type: ACTION_TYPES.DELETE_DATASOURCE_CONSTRAINTS,
  payload: axios.delete(`${apiUrl}/${id}`),
});

export const setDatasourceConstraints = (constraint: IUserGroupDatasourceConstraints) => ({
  type: ACTION_TYPES.SET_DATASOURCE_CONSTRAINTS,
  payload: constraint,
});

export const updateCondition = (condition:IUserGroupFeatureConstraint) => ({
  type: ACTION_TYPES.UPDATE_CONDITION,
  payload: condition,
});

export const addConstraint = () => ({
  type: ACTION_TYPES.ADD_CONSTRAINT,
});

export const removeConstraint = condition => ({
  type: ACTION_TYPES.REMOVE_CONSTRAINT,
  payload: condition,
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
