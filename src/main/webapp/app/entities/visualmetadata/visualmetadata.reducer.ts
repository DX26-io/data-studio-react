import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IVisualMetadata, defaultValue } from 'app/shared/model/visual-meta-data.model';
import { IVisualMetaDataDTO } from 'app/shared/model/visualmeta-data-dto.model';
import { IValidateDTO } from 'app/shared/model/validate.model';
import {
  visualMetadataContainerAdd,
  visualMetadataContainerRemove,
  visualMetadataContainerUpdate,
} from 'app/modules/canvas/visualization/util/visualmetadata-container.util';
import { getVisualizationData, ValidateFields } from 'app/modules/canvas/visualization/util/visualization-render-utils';
import { ICrudPutActionVisual } from './visualmetadata-util';

export const ACTION_TYPES = {
  FETCH_VISUALMETADATA_LIST: 'visualmetadata/FETCH_VISUALMETADATA_LIST',
  FETCH_VISUALMETADATA: 'visualmetadata/FETCH_VISUALMETADATA',
  CREATE_VISUALMETADATA: 'visualmetadata/CREATE_VISUALMETADATA',
  UPDATE_VISUALMETADATA: 'visualmetadata/UPDATE_VISUALMETADATA',
  DELETE_VISUALMETADATA: 'visualmetadata/DELETE_VISUALMETADATA',
  RESET: 'visualmetadata/RESET',
  VALIDATE_QUERY: 'visualmetadata/VALIDATE_QUERYDTO',
  TOGGLE_EDIT_MODE: 'visualmetadata/TOGGLE_EDIT_MODE',
  SET_VISUAL: 'visualmetadata/SET_VISUAL',
  SET_EDIT_ACTION: 'visualmetadata/SET_EDIT_ACTION',
  VISUAL_METADATA_CONTAINER_ADD: 'visualmetadata/VISUAL_METADATA_CONTAINER_ADD',
  VISUAL_METADATA_CONTAINER_UPDATE: 'visualmetadata/VISUAL_METADATA_CONTAINER_UPDATE',
  VISUAL_METADATA_CONTAINER_REMOVE: 'visualmetadata/VISUAL_METADATA_CONTAINER_REMOVE',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IVisualMetadata>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  newCreated: false,
  deleteSuccess: false,
  isvisualMetaDataFetched: false,
  rowQuery: null,
  filterData: {},
  selectedFilter: {},
  validateQueryError: null,
  isEditMode: false,
  visual: {},
  editAction: '',
  visualMetadataContainerList: [],
};

export type VisualmetadataState = Readonly<typeof initialState>;

// Reducer

export default (state: VisualmetadataState = initialState, action): VisualmetadataState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_VISUALMETADATA_LIST):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.FETCH_VISUALMETADATA):
      return {
        ...state,
        errorMessage: null,
        isvisualMetaDataFetched: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_VISUALMETADATA):
      return {
        ...state,
        errorMessage: null,
        newCreated: false,
        updating: true,
      };
    case REQUEST(ACTION_TYPES.UPDATE_VISUALMETADATA):
    case REQUEST(ACTION_TYPES.DELETE_VISUALMETADATA):
      return {
        ...state,
        errorMessage: null,
        deleteSuccess: false,
        newCreated: false,
        updating: true,
      };

    case FAILURE(ACTION_TYPES.FETCH_VISUALMETADATA):
      return {
        ...state,
        isvisualMetaDataFetched: false,
        errorMessage: action.payload,
      };
    case REQUEST(ACTION_TYPES.VALIDATE_QUERY):
    case FAILURE(ACTION_TYPES.FETCH_VISUALMETADATA_LIST):
    case FAILURE(ACTION_TYPES.CREATE_VISUALMETADATA):
      return {
        ...state,
        loading: false,
        updating: false,
        newCreated: false,
        errorMessage: action.payload,
      };
    case FAILURE(ACTION_TYPES.UPDATE_VISUALMETADATA):
    case FAILURE(ACTION_TYPES.DELETE_VISUALMETADATA):
      return {
        ...state,
        loading: false,
        updating: false,
        deleteSuccess: false,
        newCreated: false,
        errorMessage: action.payload,
      };
    case FAILURE(ACTION_TYPES.VALIDATE_QUERY):
      return {
        ...state,
        validateQueryError: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_VISUALMETADATA_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_VISUALMETADATA):
      return {
        ...state,
        loading: false,
        isvisualMetaDataFetched: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_VISUALMETADATA):
      return {
        ...state,
        loading: false,
        updating: false,
        newCreated: true,
        errorMessage: action.payload,
        entity: action.payload.data,
        visualMetadataContainerList: visualMetadataContainerAdd(action.payload.data),
      };
    case SUCCESS(ACTION_TYPES.UPDATE_VISUALMETADATA):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
        visualMetadataContainerList: visualMetadataContainerUpdate(action.payload.data.id, action.payload.data, 'id'),
      };
    case SUCCESS(ACTION_TYPES.DELETE_VISUALMETADATA):
      return {
        ...state,
        updating: false,
        deleteSuccess: true,
        newCreated: false,
        entity: {},
        visualMetadataContainerList: visualMetadataContainerRemove(action.payload.headers['x-flairbiapp-params']),
      };
    case SUCCESS(ACTION_TYPES.VALIDATE_QUERY):
      return {
        ...state,
        rowQuery: action.payload.data,
      };
    case ACTION_TYPES.TOGGLE_EDIT_MODE:
      return {
        ...state,
        isEditMode: !state.isEditMode,
      };
    case ACTION_TYPES.SET_VISUAL:
      return {
        ...state,
        visual: action.payload,
      };
    case ACTION_TYPES.SET_EDIT_ACTION:
      return {
        ...state,
        editAction: action.payload,
      };
    case ACTION_TYPES.VISUAL_METADATA_CONTAINER_ADD:
      return {
        ...state,
        visualMetadataContainerList: action.payload,
      };
    case ACTION_TYPES.VISUAL_METADATA_CONTAINER_REMOVE:
      return {
        ...state,
        visualMetadataContainerList: action.payload,
      };
    case ACTION_TYPES.VISUAL_METADATA_CONTAINER_UPDATE:
      return {
        ...state,
        visualMetadataContainerList: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/visualmetadata';

// Actions

export const renderVisualizationById = (visual, view, filter) => {
  if (ValidateFields(visual.fields)) {
    getVisualizationData(visual, view, filter);
  }
};

export const getEntities: ICrudGetAllAction<IVisualMetadata> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_VISUALMETADATA_LIST,
  payload: axios.get<IVisualMetadata>(`${apiUrl}?cacheBuster=${new Date().getTime()}`),
});

export const getEntity: ICrudGetAction<IVisualMetadata> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_VISUALMETADATA,
    payload: axios.get<IVisualMetadata>(requestUrl),
  };
};

export const createEntity: ICrudPutAction<IVisualMetaDataDTO> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_VISUALMETADATA,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const validate: ICrudPutAction<IValidateDTO> = entity => async dispatch => {
  const requestUrl = `${apiUrl}/${'validate'}`;
  const result = await dispatch({
    type: ACTION_TYPES.VALIDATE_QUERY,
    payload: axios.post(requestUrl, entity),
  });
  return result;
};

export const updateEntity: ICrudPutActionVisual<IVisualMetaDataDTO> = (entity, view, filter) => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_VISUALMETADATA,
    payload: axios.put(apiUrl, cleanEntity(entity)),
  });
  return result;
};

export const deleteEntity: ICrudDeleteAction<IVisualMetadata> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_VISUALMETADATA,
    payload: axios.delete(requestUrl),
  });
  // dispatch(getEntities());
  return result;
};

export const toggleEditMode = () => ({
  type: ACTION_TYPES.TOGGLE_EDIT_MODE,
});

export const setVisual = v => ({
  type: ACTION_TYPES.TOGGLE_EDIT_MODE,
  payload: v,
});

export const setEditAction = action => ({
  type: ACTION_TYPES.TOGGLE_EDIT_MODE,
  payload: action,
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

export const metadataContainerAdd = (widget: any) => ({
  type: ACTION_TYPES.VISUAL_METADATA_CONTAINER_ADD,
  payload: visualMetadataContainerAdd(widget),
});

export const metadataContainerRemove = (id: string) => ({
  type: ACTION_TYPES.VISUAL_METADATA_CONTAINER_REMOVE,
  payload: visualMetadataContainerRemove(id),
});

export const metadataContainerUpdate = (id: string, widget: any, key: string) => ({
  type: ACTION_TYPES.VISUAL_METADATA_CONTAINER_UPDATE,
  payload: visualMetadataContainerUpdate(id, widget, key),
});
