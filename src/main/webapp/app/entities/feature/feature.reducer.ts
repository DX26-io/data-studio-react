import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ICrudGetViewFeaturesAction, onSetDatesInFeature } from './feature-util';
import { IFeature, defaultValue } from 'app/shared/model/feature.model';

const updateFeaturesState = (features, url) => {
  const params = new URLSearchParams(url);
  const id = url.split('id=')[1].split('&')[0];
  const pin = params.get('pin');
  const foundIndex = features.findIndex(f => f.id === Number(id));
  features[foundIndex].pin = pin === 'true';
  return Object.assign([], features);
};

export const ACTION_TYPES = {
  FETCH_FEATURE_LIST: 'feature/FETCH_FEATURE_LIST',
  FETCH_FEATURE: 'feature/FETCH_FEATURE',
  CREATE_FEATURE: 'feature/CREATE_FEATURE',
  UPDATE_FEATURE: 'feature/UPDATE_FEATURE',
  DELETE_FEATURE: 'feature/DELETE_FEATURE',
  RESET: 'feature/RESET',
  SET_FEATURE: 'feature/SET_FEATURE',
  PIN_FEATURE: 'feature/PIN_FEATURE',
  SET_DATES_IN_FEATURE_LIST: 'feature/SET_DATES_IN_FEATURE_LIST',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as Array<IFeature>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  feature: (null as unknown) as IFeature,
  isFeaturesReceived: false,
  isPinnedFeatureListUpdated: false,
};

export type FeatureState = Readonly<typeof initialState>;

// Reducer

export default (state: FeatureState = initialState, action): FeatureState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_FEATURE_LIST):
      return {
        ...state,
        isFeaturesReceived: false,
      };
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
    case REQUEST(ACTION_TYPES.PIN_FEATURE):
      return {
        ...state,
        errorMessage: null,
        isPinnedFeatureListUpdated: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_FEATURE_LIST):
      return {
        ...state,
        isFeaturesReceived: false,
      };
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
    case FAILURE(ACTION_TYPES.PIN_FEATURE):
      return {
        ...state,
        errorMessage: action.payload,
        isPinnedFeatureListUpdated: false,
        updating: false,
      };
    case SUCCESS(ACTION_TYPES.FETCH_FEATURE_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        isFeaturesReceived: true,
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
    case SUCCESS(ACTION_TYPES.PIN_FEATURE):
      return {
        ...state,
        isPinnedFeatureListUpdated: true,
        updating: false,
        entities: updateFeaturesState(state.entities, action.payload.config.url),
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
    case ACTION_TYPES.SET_DATES_IN_FEATURE_LIST:
      return {
        ...state,
        entities: onSetDatesInFeature(state.entities, action.payload.featureName,action.payload.startDate,action.payload.endDate),
      };
    default:
      return state;
  }
};

const apiUrl = 'api/features';

// Actions

export const getViewFeaturesEntities: ICrudGetViewFeaturesAction<IFeature> = viewId => ({
  type: ACTION_TYPES.FETCH_FEATURE_LIST,
  payload: axios.get<IFeature>(`${apiUrl}?view=${viewId}&isSelected=true&cacheBuster=${new Date().getTime()}`),
});

export const getDatasourceFeaturesEntities: ICrudGetViewFeaturesAction<IFeature> = datasourceId => ({
  type: ACTION_TYPES.FETCH_FEATURE_LIST,
  payload: axios.get<IFeature>(`${apiUrl}?datasourceId=${datasourceId}&cacheBuster=${new Date().getTime()}`),
});

export const getEntities: ICrudGetAllAction<IFeature> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_FEATURE_LIST,
  payload: axios.get<IFeature>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntitiesByFeatureType = (datasourceId: number, featureType: string) => ({
  type: ACTION_TYPES.FETCH_FEATURE_LIST,
  payload: axios.get(`api/features?datasource=${datasourceId}&featureType=${featureType}`),
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

export const pinFeature = (id, pin) => dispatch => {
  dispatch({
    type: ACTION_TYPES.PIN_FEATURE,
    payload: axios.put(`${apiUrl}/pinFilter/?id=${id}&pin=${pin}`),
    Meta: { id, pin },
  });
};

export const getDimensionsList = features => {
  const dimensionsList = [];
  features.map(item => {
    if (item.featureType === 'DIMENSION') {
      dimensionsList.push({ value: item.name, label: item.name });
    }
  });
  return dimensionsList;
};

export const getMeasuresList = features => {
  const measuresList = [];
  features.map(item => {
    if (item.featureType === 'MEASURE') {
      measuresList.push({ value: item.name, label: item.name });
    }
  });
  return measuresList;
};

export const getThresholdMeasuresList = features => {
  const measuresList = [];
  features.map(item => {
    if (item.feature.featureType === 'MEASURE') {
      measuresList.push({ value: item.feature.name, label: item.feature.name });
    }
  });
  return measuresList;
};

export const setDatesInFeature = (featureName,startDate,endDate) => ({
  type: ACTION_TYPES.SET_DATES_IN_FEATURE_LIST,
  payload: {featureName,startDate,endDate},
});
