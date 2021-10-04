import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IVisualisations, defaultValue } from 'app/shared/model/visualisations.model';

export const ACTION_TYPES = {
  FETCH_VISUALISATIONS_LIST: 'visualisations/FETCH_VISUALISATIONS_LIST',
  FETCH_VISUALISATIONS: 'visualisations/FETCH_VISUALISATIONS',
  CREATE_VISUALISATIONS: 'visualisations/CREATE_VISUALISATIONS',
  UPDATE_VISUALISATIONS: 'visualisations/UPDATE_VISUALISATIONS',
  DELETE_VISUALISATIONS: 'visualisations/DELETE_VISUALISATIONS',
  RESET: 'visualisations/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IVisualisations>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
};

export type VisualisationsState = Readonly<typeof initialState>;

// Reducer

export default (state: VisualisationsState = initialState, action): VisualisationsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_VISUALISATIONS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_VISUALISATIONS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_VISUALISATIONS):
    case REQUEST(ACTION_TYPES.UPDATE_VISUALISATIONS):
    case REQUEST(ACTION_TYPES.DELETE_VISUALISATIONS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_VISUALISATIONS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_VISUALISATIONS):
    case FAILURE(ACTION_TYPES.CREATE_VISUALISATIONS):
    case FAILURE(ACTION_TYPES.UPDATE_VISUALISATIONS):
    case FAILURE(ACTION_TYPES.DELETE_VISUALISATIONS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_VISUALISATIONS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_VISUALISATIONS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_VISUALISATIONS):
    case SUCCESS(ACTION_TYPES.UPDATE_VISUALISATIONS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_VISUALISATIONS):
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

const apiUrl = 'api/visualisations';

// Actions

export const getEntities: ICrudGetAllAction<IVisualisations> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_VISUALISATIONS_LIST,
  payload: axios.get<IVisualisations>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IVisualisations> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_VISUALISATIONS,
    payload: axios.get<IVisualisations>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IVisualisations> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_VISUALISATIONS,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IVisualisations> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_VISUALISATIONS,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IVisualisations> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_VISUALISATIONS,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
