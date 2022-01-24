import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ICrudPutAction, ICrudDeleteAction, ICrudGetAllAction, ICrudGetAction } from 'react-jhipster';
import { IDatasourceConstraints, defaultValue } from 'app/shared/model/datasource-constraints.model';
import { defaultValue as conditionDefaultValue } from 'app/shared/model/feature-constraint.model';
import { object } from 'prop-types';
export const ACTION_TYPES = {
  FETCH_USER_DATASOURCE_CONSTRAINTS: 'datasource-constraints/FETCH_USER_DATASOURCE_CONSTRAINTS',
  FETCH_USER_GROUP_DATASOURCE_CONSTRAINTS: 'datasource-constraints/FETCH_USER_GROUP_DATASOURCE_CONSTRAINTS',
  FETCH_DATASOURCE_CONSTRAINTS: 'datasource-constraints/FETCH_DATASOURCE_CONSTRAINTS',
  SET_DATASOURCE_CONSTRAINTS: 'datasource-constraints/SET_DATASOURCE_CONSTRAINTS',
  CREATE_DATASOURCE_CONSTRAINTS: 'datasource-constraints/CREATE_DATASOURCE_CONSTRAINTS',
  UPDATE_DATASOURCE_CONSTRAINTS: 'datasource-constraints/UPDATE_DATASOURCE_CONSTRAINTS',
  DELETE_DATASOURCE_CONSTRAINTS: 'datasource-constraints/DELETE_DATASOURCE_CONSTRAINTS',
  ADD_CONSTRAINT: 'datasource-constraints/ADD_CONSTRAINT',
  REMOVE_CONSTRAINT: 'datasource-constraints/REMOVE_CONSTRAINT',
  RESET: 'datasource-constraints/RESET',
  UPDATE_CONDITION_VALUES: 'datasource-constraints/UPDATE_CONDITION_VALUES',
};

const resetConstraint = (constraint, condition) => {
  constraint.constraintDefinition.featureConstraints[0] = condition;
  return Object.assign({}, constraint);
};

const updateConditionInConstraint = (constraint, condition) => {
  const index = constraint.constraintDefinition.featureConstraints.indexOf(condition);
  if (index > -1) {
    constraint.constraintDefinition.featureConstraints[index] = condition;
  }
  return Object.assign({}, constraint);
};

const removeConstraintFromList = (constraint, condition) => {
  const index = constraint.constraintDefinition.featureConstraints.indexOf(condition);
  if (index > -1) {
    constraint.constraintDefinition.featureConstraints.splice(index, 1);
  }
  return Object.assign({}, constraint);
};

const addConstraintIntoList = constraint => {
  constraint.constraintDefinition.featureConstraints.push({ ...conditionDefaultValue });
  return Object.assign({}, constraint);
};

const updateConditionStateValues = (constraint, condition, values) => {
  if (values && values.length > 0) {
    condition.values = values.map(val => val.value);
  } else {
    condition.values = [];
  }
  return updateConditionInConstraint(constraint, condition);
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

export type UserDatasourceConstraintsState = Readonly<typeof initialState>;

// Reducer
export default (state: UserDatasourceConstraintsState = initialState, action): UserDatasourceConstraintsState => {
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
    case SUCCESS(ACTION_TYPES.FETCH_DATASOURCE_CONSTRAINTS):
      return {
        ...state,
        loading: false,
        constraint: action.payload.data,
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
        constraint: addConstraintIntoList(state.constraint),
      };
    case ACTION_TYPES.REMOVE_CONSTRAINT:
      return {
        ...state,
        constraint: removeConstraintFromList(state.constraint, action.payload),
      };
    case ACTION_TYPES.UPDATE_CONDITION_VALUES:
      return {
        ...state,
        constraint: updateConditionStateValues(state.constraint, action.payload.condition, action.payload.values),
      };
    case ACTION_TYPES.RESET:
      return {
        ...state,
        constraint: resetConstraint(defaultValue, { '@type': '', featureName: '', values: [] }),
        updateSuccess: false,
        errorMessage: null,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/datasource-constraints';

export const getUserGroupDatasourceConstraints = (name: string) => ({
  type: ACTION_TYPES.FETCH_USER_GROUP_DATASOURCE_CONSTRAINTS,
  payload: axios.get(`api/datasource-group-constraints?userGroup.name=${name}`),
});

export const getUserDatasourceConstraints = (login: string) => ({
  type: ACTION_TYPES.FETCH_USER_DATASOURCE_CONSTRAINTS,
  payload: axios.get(`${apiUrl}?user.login=${login}`),
});

export const getDatasourceConstraints: ICrudGetAction<IDatasourceConstraints> = (id: number) => ({
  type: ACTION_TYPES.FETCH_DATASOURCE_CONSTRAINTS,
  payload: axios.get(`${apiUrl}/${id}`),
});

export const createDatasourceConstraints: ICrudPutAction<IDatasourceConstraints> = entity => ({
  type: ACTION_TYPES.CREATE_DATASOURCE_CONSTRAINTS,
  payload: axios.post(`${apiUrl}`, entity),
});

export const updateDatasourceConstraints: ICrudPutAction<IDatasourceConstraints> = entity => ({
  type: ACTION_TYPES.CREATE_DATASOURCE_CONSTRAINTS,
  payload: axios.put(`${apiUrl}`, entity),
});

export const deleteDatasourceConstraints: ICrudDeleteAction<IDatasourceConstraints> = (id: number) => ({
  type: ACTION_TYPES.DELETE_DATASOURCE_CONSTRAINTS,
  payload: axios.delete(`${apiUrl}/${id}`),
});

export const setDatasourceConstraints = (constraint: IDatasourceConstraints) => ({
  type: ACTION_TYPES.SET_DATASOURCE_CONSTRAINTS,
  payload: constraint,
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

export const updateConditionValues = (condition, values) => ({
  type: ACTION_TYPES.UPDATE_CONDITION_VALUES,
  payload: { condition, values },
});
