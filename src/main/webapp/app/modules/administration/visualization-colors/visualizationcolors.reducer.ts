import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IVisualizationcolors, defaultValue } from 'app/shared/model/visualizationcolors.model';

export const ACTION_TYPES = {
  FETCH_VISUALIZATION_COLOR: 'visualizationcolors/FETCH_VISUALIZATION_COLOR',
  FETCH_VISUALIZATION_COLORS: 'visualizationcolors/FETCH_VISUALIZATION_COLORS',
  CREATE_VISUALIZATION_COLORS: 'visualizationcolors/CREATE_VISUALIZATION_COLORS',
  UPDATE_VISUALIZATION_COLORS: 'visualizationcolors/UPDATE_VISUALIZATION_COLORS',
  DELETE_VISUALIZATION_COLORS: 'visualizationcolors/DELETE_VISUALIZATION_COLORS',
  RESET: 'visualizationcolors/RESET',
  SET_VISUALIZATION_COLORS: 'visualizationcolors/SET_VISUALIZATION_COLORS',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IVisualizationcolors>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type VisualizationColorsState = Readonly<typeof initialState>;

// Reducer

export default (state: VisualizationColorsState = initialState, action): VisualizationColorsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_VISUALIZATION_COLOR):
    case REQUEST(ACTION_TYPES.FETCH_VISUALIZATION_COLORS):
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
    case FAILURE(ACTION_TYPES.FETCH_VISUALIZATION_COLOR):
    case FAILURE(ACTION_TYPES.FETCH_VISUALIZATION_COLORS):
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
    case SUCCESS(ACTION_TYPES.FETCH_VISUALIZATION_COLOR):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_VISUALIZATION_COLORS):
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
        entity: {},
      };
    case SUCCESS(ACTION_TYPES.SET_VISUALIZATION_COLORS):
      return {
        ...state,
        entity: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/visualization-colors';

// Actions

export const getEntities: ICrudGetAllAction<IVisualizationcolors> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_VISUALIZATION_COLOR,
  payload: axios.get<IVisualizationcolors>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IVisualizationcolors> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_VISUALIZATION_COLORS,
    payload: axios.get<IVisualizationcolors>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IVisualizationcolors> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_VISUALIZATION_COLORS,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IVisualizationcolors> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_VISUALIZATION_COLORS,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IVisualizationcolors> = id => async dispatch => {
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

export const setVisualizationColor = visualizationColor => async dispatch => {
  await dispatch({
    type: ACTION_TYPES.SET_VISUALIZATION_COLORS,
    payload: visualizationColor,
  });
};
