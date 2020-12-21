import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IVisualizations, defaultValue } from 'app/shared/model/visualizations.model';

export const ACTION_TYPES = {
  FETCH_VISUALIZATIONS_LIST: 'visualizations/FETCH_VISUALIZATIONS_LIST',
  FETCH_VISUALIZATIONS: 'visualizations/FETCH_VISUALIZATIONS',
  CREATE_VISUALIZATIONS: 'visualizations/CREATE_VISUALIZATIONS',
  UPDATE_VISUALIZATIONS: 'visualizations/UPDATE_VISUALIZATIONS',
  DELETE_VISUALIZATIONS: 'visualizations/DELETE_VISUALIZATIONS',
  RESET: 'visualizations/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IVisualizations>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type VisualizationsState = Readonly<typeof initialState>;

// Reducer

export default (state: VisualizationsState = initialState, action): VisualizationsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_VISUALIZATIONS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_VISUALIZATIONS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_VISUALIZATIONS):
    case REQUEST(ACTION_TYPES.UPDATE_VISUALIZATIONS):
    case REQUEST(ACTION_TYPES.DELETE_VISUALIZATIONS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_VISUALIZATIONS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_VISUALIZATIONS):
    case FAILURE(ACTION_TYPES.CREATE_VISUALIZATIONS):
    case FAILURE(ACTION_TYPES.UPDATE_VISUALIZATIONS):
    case FAILURE(ACTION_TYPES.DELETE_VISUALIZATIONS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_VISUALIZATIONS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_VISUALIZATIONS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_VISUALIZATIONS):
    case SUCCESS(ACTION_TYPES.UPDATE_VISUALIZATIONS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_VISUALIZATIONS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/visualizations';

// Actions

export const getEntities: ICrudGetAllAction<IVisualizations> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_VISUALIZATIONS_LIST,
  payload: axios.get<IVisualizations>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IVisualizations> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_VISUALIZATIONS,
    payload: axios.get<IVisualizations>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IVisualizations> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_VISUALIZATIONS,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IVisualizations> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_VISUALIZATIONS,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IVisualizations> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_VISUALIZATIONS,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
