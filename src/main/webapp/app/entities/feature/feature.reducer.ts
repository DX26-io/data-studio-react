import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ICrudGetViewFeaturesAction } from './feature-util';
import { IFeature, defaultValue } from 'app/shared/model/feature.model';

export const ACTION_TYPES = {
  FETCH_FEATURE_LIST: 'feature/FETCH_FEATURE_LIST',
  FETCH_FEATURE: 'feature/FETCH_FEATURE',
  CREATE_FEATURE: 'feature/CREATE_FEATURE',
  UPDATE_FEATURE: 'feature/UPDATE_FEATURE',
  DELETE_FEATURE: 'feature/DELETE_FEATURE',
  RESET: 'feature/RESET',
  SET_FEATURE: 'feature/SET_FEATURE',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IFeature>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  feature: (null as unknown) as IFeature,
};

export type FeatureState = Readonly<typeof initialState>;

// Reducer

export default (state: FeatureState = initialState, action): FeatureState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_FEATURE_LIST):
    case REQUEST(ACTION_TYPES.FETCH_FEATURE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_FEATURE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case REQUEST(ACTION_TYPES.UPDATE_FEATURE):
    case REQUEST(ACTION_TYPES.DELETE_FEATURE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_FEATURE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_FEATURE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case FAILURE(ACTION_TYPES.CREATE_FEATURE):
      return {
        ...state,
        errorMessage: action.payload,
        updateSuccess: false,
        updating: false,
      };
    case FAILURE(ACTION_TYPES.UPDATE_FEATURE):
    case FAILURE(ACTION_TYPES.DELETE_FEATURE):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_FEATURE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_FEATURE):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_FEATURE):
      return {
        ...state,
        updateSuccess: true,
        errorMessage: null,
        updating: false,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_FEATURE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        feature: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_FEATURE):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        feature: defaultValue,
      };

    case ACTION_TYPES.RESET:
      return {
        ...state,
        feature: null,
        errorMessage: null,
        updateSuccess: false,
      };
    case ACTION_TYPES.SET_FEATURE:
      return {
        ...state,
        feature: action.payload,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/features';

// Actions

export const getViewFeaturesEntities: ICrudGetViewFeaturesAction<IFeature> = viewId => ({
  type: ACTION_TYPES.FETCH_FEATURE_LIST,
  payload: axios.get<IFeature>(`${apiUrl}?view=${viewId}&cacheBuster=${new Date().getTime()}`),
});

export const getEntities: ICrudGetAllAction<IFeature> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_FEATURE_LIST,
  payload: axios.get<IFeature>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const createEntity: ICrudPutAction<IFeature> = entity => ({
  type: ACTION_TYPES.CREATE_FEATURE,
  payload: axios.post<IFeature>(`${apiUrl}`, entity),
});

export const updateEntity: ICrudPutAction<IFeature> = entity => ({
  type: ACTION_TYPES.UPDATE_FEATURE,
  payload: axios.put<IFeature>(`${apiUrl}`, entity),
});

export const deleteEntity: ICrudDeleteAction<IFeature> = id => ({
  type: ACTION_TYPES.DELETE_FEATURE,
  payload: axios.delete(`${apiUrl}/${id}`),
});

export const getEntity: ICrudGetAction<IFeature> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_FEATURE,
    payload: axios.get<IFeature>(requestUrl),
  };
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

export const setFeature = (feature: IFeature) => ({
  type: ACTION_TYPES.SET_FEATURE,
  payload: feature,
});
