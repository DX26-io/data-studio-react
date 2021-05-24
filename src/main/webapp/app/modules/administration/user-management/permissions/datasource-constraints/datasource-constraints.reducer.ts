import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ICrudPutAction, ICrudDeleteAction, ICrudGetAllAction, ICrudGetAction } from 'react-jhipster';
import { IDatasourceConstraints, defaultValue } from 'app/shared/model/datasource-constraints.model';

export const ACTION_TYPES = {
  FETCH_USER_DATASOURCE_CONSTRAINTS: 'datasource-constraints/FETCH_USER_DATASOURCE_CONSTRAINTS',
  FETCH_USER_GROUP_DATASOURCE_CONSTRAINTS: 'datasource-constraints/FETCH_USER_GROUP_DATASOURCE_CONSTRAINTS',
  FETCH_FEATURES: 'permission/FETCH_FEATURES',
  FETCH_DATASOURCE_CONSTRAINTS: 'datasource-constraints/FETCH_DATASOURCE_CONSTRAINTS',
  SET_DATASOURCE_CONSTRAINTS: 'datasource-constraints/SET_DATASOURCE_CONSTRAINTS',
  CREATE_DATASOURCE_CONSTRAINTS: 'datasource-constraints/CREATE_DATASOURCE_CONSTRAINTS',
  UPDATE_DATASOURCE_CONSTRAINTS: 'datasource-constraints/UPDATE_DATASOURCE_CONSTRAINTS',
  DELETE_DATASOURCE_CONSTRAINTS: 'datasource-constraints/DELETE_DATASOURCE_CONSTRAINTS',
  ADD_CONSTRAINT: 'datasource-constraints/ADD_CONSTRAINT',
  REMOVE_CONSTRAINT: 'datasource-constraints/REMOVE_CONSTRAINT',
  RESET: 'datasource-constraints/RESET',
};

const removeConstraintFromList = (constraint, condition) => {
  const index = constraint.constraintDefinition.featureConstraints.indexOf(condition);
  if (index > -1) {
    constraint.constraintDefinition.featureConstraints.splice(index, 1);
  }
  return constraint;
};

const addConstraintIntoList = constraint => {
  constraint.constraintDefinition.featureConstraints.push(defaultValue);
  return constraint;
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
    case REQUEST(ACTION_TYPES.FETCH_FEATURES):
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
    case FAILURE(ACTION_TYPES.FETCH_FEATURES):
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
    case SUCCESS(ACTION_TYPES.FETCH_FEATURES):
      return {
        ...state,
        loading: false,
        features: action.payload.data,
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
        constraint: action.payload,
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
    case ACTION_TYPES.RESET:
      return {
        ...state,
        constraint: defaultValue,
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

// TODO : below menthod will be removed once khushbu's pr is merged with master
export const getFeatures = (datasourceId: number, featureType: string) => ({
  type: ACTION_TYPES.FETCH_FEATURES,
  payload: axios.get(`api/features?datasource=${datasourceId}&featureType=${featureType}`),
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
