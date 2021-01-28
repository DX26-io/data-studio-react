import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IVisualMetadata, defaultValue } from 'app/shared/model/visualMetadata.model';
import { IValidateDTO, IVisualmetaDataDTO } from './visualmetadata-util';

export const ACTION_TYPES = {
  FETCH_VISUALMETADATA_LIST: 'visualmetadata/FETCH_VISUALMETADATA_LIST',
  FETCH_VISUALMETADATA: 'visualmetadata/FETCH_VISUALMETADATA',
  CREATE_VISUALMETADATA: 'visualmetadata/CREATE_VISUALMETADATA',
  UPDATE_VISUALMETADATA: 'visualmetadata/UPDATE_VISUALMETADATA',
  DELETE_VISUALMETADATA: 'visualmetadata/DELETE_VISUALMETADATA',
  RESET: 'visualmetadata/RESET',
  VALIDATE_QUERY: 'visualmetadata/VALIDATE_QUERYDTO',
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IVisualMetadata>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false,
  rowQuery: null,
};

export type VisualmetadataState = Readonly<typeof initialState>;

// Reducer

export default (state: VisualmetadataState = initialState, action): VisualmetadataState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_VISUALMETADATA_LIST):
    case REQUEST(ACTION_TYPES.FETCH_VISUALMETADATA):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_VISUALMETADATA):
    case REQUEST(ACTION_TYPES.UPDATE_VISUALMETADATA):
    case REQUEST(ACTION_TYPES.DELETE_VISUALMETADATA):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case REQUEST(ACTION_TYPES.VALIDATE_QUERY):
    case FAILURE(ACTION_TYPES.FETCH_VISUALMETADATA_LIST):
    case FAILURE(ACTION_TYPES.FETCH_VISUALMETADATA):
    case FAILURE(ACTION_TYPES.CREATE_VISUALMETADATA):
    case FAILURE(ACTION_TYPES.UPDATE_VISUALMETADATA):
    case FAILURE(ACTION_TYPES.DELETE_VISUALMETADATA):
    case FAILURE(ACTION_TYPES.VALIDATE_QUERY):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
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
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.CREATE_VISUALMETADATA):
    case SUCCESS(ACTION_TYPES.UPDATE_VISUALMETADATA):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_VISUALMETADATA):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {},
      };
    case SUCCESS(ACTION_TYPES.VALIDATE_QUERY):
      return {
        ...state,
        rowQuery: action.payload.data,
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

export const createEntity: ICrudPutAction<IVisualmetaDataDTO> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_VISUALMETADATA,
    payload: axios.post(apiUrl, cleanEntity(entity)),
  });
  //dispatch(getEntities());
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

export const validate: ICrudPutAction<IValidateDTO> = entity => async dispatch => {
  const requestUrl = `${apiUrl}/${'validate'}`;
  const result = await dispatch({
    type: ACTION_TYPES.VALIDATE_QUERY,
    payload: axios.post(requestUrl, entity),
  });
  return result;
};

export const updateEntity: ICrudPutAction<IVisualmetaDataDTO> = entity => async dispatch => {
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

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
