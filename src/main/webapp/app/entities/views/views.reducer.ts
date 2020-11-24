import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IViews, defaultValue } from 'app/shared/model/views.model';

export const ACTION_TYPES = {
  FETCH_VIEWS_LIST: 'views/FETCH_VIEWS_LIST',
  FETCH_VIEWS: 'views/FETCH_VIEWS',
  CREATE_VIEWS: 'views/CREATE_VIEWS',
  UPDATE_VIEWS: 'views/UPDATE_VIEWS',
  DELETE_VIEWS: 'views/DELETE_VIEWS',
  SET_BLOB: 'views/SET_BLOB',
  RESET: 'views/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IViews>,
  entity: defaultValue,
  updating: false,
  totalItems: 0,
  updateSuccess: false,
};

export type ViewsState = Readonly<typeof initialState>;

// Reducer

export default (state: ViewsState = initialState, action): ViewsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_VIEWS_LIST):
    case REQUEST(ACTION_TYPES.FETCH_VIEWS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_VIEWS):
    case REQUEST(ACTION_TYPES.UPDATE_VIEWS):
    case REQUEST(ACTION_TYPES.DELETE_VIEWS):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_VIEWS_LIST):
    case FAILURE(ACTION_TYPES.FETCH_VIEWS):
    case FAILURE(ACTION_TYPES.CREATE_VIEWS):
    case FAILURE(ACTION_TYPES.UPDATE_VIEWS):
    case FAILURE(ACTION_TYPES.DELETE_VIEWS):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_VIEWS_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_VIEWS):
      return {
        ...state,
        loading: false,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_VIEWS):
    case SUCCESS(ACTION_TYPES.UPDATE_VIEWS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_VIEWS):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case ACTION_TYPES.SET_BLOB: {
      const { name, data, contentType } = action.payload;
      return {
        ...state,
        entity: {
          ...state.entity,
          [name]: data,
          [name + 'ContentType']: contentType,
        },
      };
    }
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/views';

// Actions

export const getEntities: ICrudGetAllAction<IViews> = (viewDashboard, page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}&viewDashboard=${viewDashboard}&paginate=true`;
  return {
    type: ACTION_TYPES.FETCH_VIEWS_LIST,
    payload: axios.get<IViews>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntity: ICrudGetAction<IViews> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_VIEWS,
    payload: axios.get<IViews>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IViews> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_VIEWS,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IViews> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_VIEWS,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IViews> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_VIEWS,
    payload: axios.delete(requestUrl),
  });
  dispatch(getEntities());
  return result;
};

export const setBlob = (name, data, contentType?) => ({
  type: ACTION_TYPES.SET_BLOB,
  payload: {
    name,
    data,
    contentType,
  },
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
