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
  RESET: 'feature/RESET',
  SELECT_FEATURE: 'feature/SELECT_FEATURE',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IFeature>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  selectedFeature: (null as unknown) as IFeature,
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
    case FAILURE(ACTION_TYPES.FETCH_FEATURE_LIST):
    case FAILURE(ACTION_TYPES.FETCH_FEATURE):
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

    case ACTION_TYPES.RESET:
      return {
        ...initialState,
        selectedFeature: null,
      };
    case ACTION_TYPES.SELECT_FEATURE:
      return {
        ...initialState,
        selectedFeature: action.payload,
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

export const selectFeature = (feature: IFeature) => ({
  type: ACTION_TYPES.SELECT_FEATURE,
  payload: feature,
});
