import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IVisualisationColors, defaultValue } from 'app/shared/model/visualization-colors.model';

export const ACTION_TYPES = {
  FETCH_VISUALIZATION_COLORS: 'visualisationColors/FETCH_VISUALIZATION_COLORS',
  FETCH_VISUALIZATION_COLOR: 'visualisationColors/FETCH_VISUALIZATION_COLOR',
  CREATE_VISUALIZATION_COLORS: 'visualisationColors/CREATE_VISUALIZATION_COLORS',
  UPDATE_VISUALIZATION_COLORS: 'visualisationColors/UPDATE_VISUALIZATION_COLORS',
  DELETE_VISUALIZATION_COLORS: 'visualisationColors/DELETE_VISUALIZATION_COLORS',
  RESET: 'visualisationColors/RESET',
  SET_VISUALIZATION_COLORS: 'visualisationColors/SET_VISUALIZATION_COLORS',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IVisualisationColors>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type VisualisationColorsState = Readonly<typeof initialState>;

// Reducer

export default (state: VisualisationColorsState = initialState, action): VisualisationColorsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_VISUALIZATION_COLORS):
    case REQUEST(ACTION_TYPES.FETCH_VISUALIZATION_COLOR):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_VISUALIZATION_COLORS):
    case REQUEST(ACTION_TYPES.UPDATE_VISUALIZATION_COLORS):
    case REQUEST(ACTION_TYPES.DELETE_VISUALIZATION_COLORS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_VISUALIZATION_COLORS):
    case FAILURE(ACTION_TYPES.FETCH_VISUALIZATION_COLOR):
    case FAILURE(ACTION_TYPES.CREATE_VISUALIZATION_COLORS):
    case FAILURE(ACTION_TYPES.UPDATE_VISUALIZATION_COLORS):
    case FAILURE(ACTION_TYPES.DELETE_VISUALIZATION_COLORS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_VISUALIZATION_COLORS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_VISUALIZATION_COLOR):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_VISUALIZATION_COLORS):
    case SUCCESS(ACTION_TYPES.UPDATE_VISUALIZATION_COLORS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_VISUALIZATION_COLORS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
      };
    case ACTION_TYPES.SET_VISUALIZATION_COLORS:
      return {
        ...state,
        entity: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...state,
        updateSuccess: false,
        entity: { id: '', code: '' },
      };
    default:
      return state;
  }
};

const apiUrl = 'api/visualization-colors';

// Actions

export const getEntities: ICrudGetAllAction<IVisualisationColors> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_VISUALIZATION_COLORS,
  payload: axios.get<IVisualisationColors>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IVisualisationColors> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_VISUALIZATION_COLOR,
    payload: axios.get<IVisualisationColors>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IVisualisationColors> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_VISUALIZATION_COLORS,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IVisualisationColors> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_VISUALIZATION_COLORS,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IVisualisationColors> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_VISUALIZATION_COLORS,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

export const setEntity = visualizationColor => {
  return {
    type: ACTION_TYPES.SET_VISUALIZATION_COLORS,
    payload: visualizationColor,
  };
};
