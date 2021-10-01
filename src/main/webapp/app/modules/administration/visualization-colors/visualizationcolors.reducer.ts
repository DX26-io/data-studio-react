import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IVisualizationcolors, defaultValue } from 'app/shared/model/visualizationcolors.model';

export const ACTION_TYPES = {
  FETCH_VISUALIZATIONCOLORS_LIST: 'visualizationcolors/FETCH_VISUALIZATIONCOLORS_LIST',
  FETCH_VISUALIZATIONCOLORS: 'visualizationcolors/FETCH_VISUALIZATIONCOLORS',
  CREATE_VISUALIZATIONCOLORS: 'visualizationcolors/CREATE_VISUALIZATIONCOLORS',
  UPDATE_VISUALIZATIONCOLORS: 'visualizationcolors/UPDATE_VISUALIZATIONCOLORS',
  DELETE_VISUALIZATIONCOLORS: 'visualizationcolors/DELETE_VISUALIZATIONCOLORS',
  RESET: 'visualizationcolors/RESET',
  SET_VISUALIZATIONCOLORS: 'visualizationcolors/SET_VISUALIZATIONCOLORS',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IVisualizationcolors>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type VisualizationcolorsState = Readonly<typeof initialState>;

// Reducer

export default (state: VisualizationcolorsState = initialState, action): VisualizationcolorsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_VISUALIZATIONCOLORS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_VISUALIZATIONCOLORS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_VISUALIZATIONCOLORS):
    case REQUEST(ACTION_TYPES.UPDATE_VISUALIZATIONCOLORS):
    case REQUEST(ACTION_TYPES.DELETE_VISUALIZATIONCOLORS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_VISUALIZATIONCOLORS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_VISUALIZATIONCOLORS):
    case FAILURE(ACTION_TYPES.CREATE_VISUALIZATIONCOLORS):
    case FAILURE(ACTION_TYPES.UPDATE_VISUALIZATIONCOLORS):
    case FAILURE(ACTION_TYPES.DELETE_VISUALIZATIONCOLORS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_VISUALIZATIONCOLORS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_VISUALIZATIONCOLORS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_VISUALIZATIONCOLORS):
    case SUCCESS(ACTION_TYPES.UPDATE_VISUALIZATIONCOLORS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_VISUALIZATIONCOLORS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case SUCCESS(ACTION_TYPES.SET_VISUALIZATIONCOLORS):
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
  type: ACTION_TYPES.FETCH_VISUALIZATIONCOLORS_LIST,
  payload: axios.get<IVisualizationcolors>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IVisualizationcolors> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_VISUALIZATIONCOLORS,
    payload: axios.get<IVisualizationcolors>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IVisualizationcolors> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_VISUALIZATIONCOLORS,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IVisualizationcolors> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_VISUALIZATIONCOLORS,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IVisualizationcolors> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_VISUALIZATIONCOLORS,
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
    type: ACTION_TYPES.SET_VISUALIZATIONCOLORS,
    payload: visualizationColor,
  });
};
