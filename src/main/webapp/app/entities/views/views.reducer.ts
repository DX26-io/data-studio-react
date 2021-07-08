import axios from 'axios';
import { ICrudDeleteAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';

import { defaultValue, IViews } from 'app/shared/model/views.model';
import { IVisualMetadataSet, IVisualMetadata } from 'app/shared/model/visual-meta-data.model';

import { ICrudGetDashboardViewsAction, ICrudViewDeleteAction, ISaveViewState, IViewStateDTO } from './view-util';
import FileSaver from 'file-saver';

export const ACTION_TYPES = {
  FETCH_VIEWS_LIST: 'views/FETCH_VIEWS_LIST',
  FETCH_VIEWS: 'views/FETCH_VIEWS',
  FETCH_VIEWS_STATE: 'views/FETCH_VIEWS_STATE',
  CREATE_VIEWS: 'views/CREATE_VIEWS',
  UPDATE_VIEWS: 'views/UPDATE_VIEWS',
  DELETE_VIEWS: 'views/DELETE_VIEWS',
  EXPORT_VIEW: 'views/EXPORT_VIEW',
  SET_EXPORT_VIEW: 'views/SET_EXPORT_VIEW',
  IMPORT_VIEW: 'views/IMPORT_VIEW',
  SET_BLOB: 'views/SET_BLOB',
  RESET: 'views/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IViews>,
  entity: defaultValue,
  updating: false,
  uploadSucceeded: false,
  totalItems: 0,
  exportViewId: 0,
  updateSuccess: false,
  viewState: {} as IVisualMetadata,
};

export type ViewsState = Readonly<typeof initialState>;

// Reducer

const saveViewToLocalDrive = (action, response, viewId) => {
  const fileData = new Blob([response], { type: 'text/plain;charset=utf-8' });
  FileSaver.saveAs(fileData, `${viewId}.json`);
};

export default (state: ViewsState = initialState, action): ViewsState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_VIEWS_LIST):
    case REQUEST(ACTION_TYPES.IMPORT_VIEW):
    case REQUEST(ACTION_TYPES.EXPORT_VIEW):
    case REQUEST(ACTION_TYPES.FETCH_VIEWS):
    case REQUEST(ACTION_TYPES.FETCH_VIEWS_STATE):
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
    case FAILURE(ACTION_TYPES.IMPORT_VIEW):
    case FAILURE(ACTION_TYPES.FETCH_VIEWS):
    case FAILURE(ACTION_TYPES.FETCH_VIEWS_STATE):
    case FAILURE(ACTION_TYPES.CREATE_VIEWS):
    case FAILURE(ACTION_TYPES.UPDATE_VIEWS):
    case FAILURE(ACTION_TYPES.DELETE_VIEWS):
    case FAILURE(ACTION_TYPES.EXPORT_VIEW):
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
    case SUCCESS(ACTION_TYPES.FETCH_VIEWS_STATE):
      return {
        ...state,
        loading: false,
        viewState: action.payload.data,
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
    case SUCCESS(ACTION_TYPES.EXPORT_VIEW):
      saveViewToLocalDrive(action, action.payload.data, state.exportViewId);
      return {
        ...state,
        loading: false,
      };
    case SUCCESS(ACTION_TYPES.IMPORT_VIEW):
      return {
        ...state,
        uploadSucceeded: true,
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
    case ACTION_TYPES.SET_EXPORT_VIEW:
      return {
        ...state,
        exportViewId: action.payload,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/views';

// Actions

export const getCurrentViewState: ICrudGetDashboardViewsAction<IVisualMetadataSet> = viewId => {
  const requestUrl = `${apiUrl}/${viewId}/viewState`;
  return {
    type: ACTION_TYPES.FETCH_VIEWS_STATE,
    payload: axios.get<IVisualMetadataSet>(`${requestUrl}?cacheBuster=${new Date().getTime()}`),
  };
};

export const saveViewState: ICrudPutAction<IViewStateDTO> = entity => async dispatch => {
  const requestUrl = `${apiUrl}/${entity._id}/viewState`;
  const result = await dispatch({
    type: ACTION_TYPES.FETCH_VIEWS_STATE,
    payload: axios.put(requestUrl, cleanEntity(entity)),
  });
  dispatch(getCurrentViewState(entity._id));
  return result;
};

export const getDashboardViewEntities: ICrudGetDashboardViewsAction<IViews> = (dashboardId, page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}&viewDashboard=${dashboardId}&paginate=true`;
  return {
    type: ACTION_TYPES.FETCH_VIEWS_LIST,
    payload: axios.get<IViews>(`${requestUrl}${sort ? '&' : '?'}cacheBuster=${new Date().getTime()}`),
  };
};

export const getEntities: ICrudGetAllAction<IViews> = (page, size, sort) => {
  const requestUrl = `${apiUrl}${sort ? `?page=${page}&size=${size}&sort=${sort}` : ''}&paginate=true`;
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
  return result;
};

export const updateEntity: ICrudPutAction<IViews> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_VIEWS,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudViewDeleteAction<IViews> = (viewId, dashboardId) => async dispatch => {
  const requestUrl = `${apiUrl}/${viewId}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_VIEWS,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const exportView: (viewId: number) => void = viewId => async dispatch => {
  dispatch({
    type: ACTION_TYPES.SET_EXPORT_VIEW,
    payload: viewId,
  });
  await dispatch({
    type: ACTION_TYPES.EXPORT_VIEW,
    payload: axios.get(`${apiUrl}/${viewId}/export?&cacheBuster=${new Date().getTime()}`, { responseType: 'arraybuffer' }),
  });
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

export const getViewsByName = (viewName: string) => {
  return {
    type: ACTION_TYPES.FETCH_VIEWS_LIST,
    payload: axios.get<IViews>(`${apiUrl}?viewName=${viewName}`),
  };
};

export const importView = (contents: string, dashboardId: number) => {
  const formData = new FormData();
  formData.append('file', new Blob([contents]), 'filename');

  return {
    type: ACTION_TYPES.IMPORT_VIEW,
    payload: axios.post(`api/dashboards/${dashboardId}/importView?cacheBuster=${new Date().getTime()}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  };
};
