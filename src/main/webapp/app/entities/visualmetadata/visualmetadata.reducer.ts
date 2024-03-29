import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IVisualMetadata, defaultValue, IVisualMetadataSet } from 'app/shared/model/visualmetadata.model';
import { IVisualMetaDataDTO } from 'app/shared/model/visualmeta-data-dto.model';
import { IValidateDTO } from 'app/shared/model/validate.model';
import { IQueryValidationResponse, defaultValue as queryValidationResponse } from 'app/shared/model/query-validation-response.model';
import {
  visualMetadataContainerAdd,
  visualMetadataContainerRemove,
  visualMetadataContainerUpdate,
  addPinnedFilters,
  removePinnedFilters,
} from 'app/modules/canvas/visualisation/util/visualmetadata-container.util';
import { getVisualisationData, ValidateFields } from 'app/modules/canvas/visualisation/util/visualisation-render-utils';
import { ICrudPutActionVisual } from './visualmetadata-util';
import { DIMENSION } from 'app/shared/util/visualisation.constants';
import { any } from 'prop-types';
import { Property } from 'app/shared/model/property.model';

const addVisualField = (visual: IVisualMetadataSet, field) => {
  visual.fields.push(field);
  return Object.assign({}, visual);
};

export const deleteVisualField = (visual: IVisualMetadataSet, field) => {
  visual.fields = visual.fields.filter(function (item) {
    return item.fieldType.id !== field.fieldType.id;
  });
  return Object.assign({}, visual);
};

const updateVisualFieldBodyProperties = (visual: IVisualMetadataSet, bodyProperties) => {
  visual.bodyProperties[bodyProperties.property] = bodyProperties.value;
  return Object.assign({}, visual);
};

const updateVisualFieldTitleProperties = (visual: IVisualMetadataSet, titleProperties) => {
  visual.titleProperties[titleProperties.property] = titleProperties.value;
  return Object.assign({}, visual);
};

const updateVisualChartProperties = (visual: IVisualMetadataSet, property: Property) => {
  const fieldIndex = visual.properties.findIndex(item => item.order === property.order);
  visual.properties[fieldIndex] = property;
  return Object.assign({}, visual);
};

export const updateVisualField = (visual: IVisualMetadataSet, field) => {
  const fieldIndex = visual.fields.findIndex(item => item.fieldType.id === field.fieldType.id);
  visual.fields[fieldIndex] = field;
  return Object.assign({}, visual);
};

const updateVisualDataProperties = (visual: IVisualMetadataSet, property: Property, fieldName: string) => {
  const field = visual.fields.filter(field => field.feature.name === fieldName)[0];
  const propertyIndex = field.properties.findIndex(item => item.order === property.order);
  field.properties[propertyIndex] = property;
  const updatedVisual = updateVisualField(visual, field);
  return updatedVisual;
};

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
  SET_VIZ_ACTION: 'visualmetadata/SET_VIZ_ACTION',
  VISUAL_METADATA_CONTAINER_ADD: 'visualmetadata/VISUAL_METADATA_CONTAINER_ADD',
  VISUAL_METADATA_CONTAINER_UPDATE: 'visualmetadata/VISUAL_METADATA_CONTAINER_UPDATE',
  VISUAL_METADATA_CONTAINER_REMOVE: 'visualmetadata/VISUAL_METADATA_CONTAINER_REMOVE',
  VISUAL_METADATA_ADD_FIELD: 'visualmetadata/VISUAL_METADATA_ADD_FIELD',
  VISUAL_METADATA_DELETE_FIELD: 'visualmetadata/VISUAL_METADATA_DELETE_FIELD',
  VISUAL_METADATA_SET_CONDITION_EXPRESSION: 'visualmetadata/VISUAL_METADATA_SET_CONDITION_EXPRESSION',
  VISUAL_METADATA_UPDATE_FIELD_BODY_PROPERTIES: 'visualmetadata/VISUAL_METADATA_UPDATE_FIELD_BODY_PROPERTIES',
  VISUAL_METADATA_UPDATE_FIELD_TITLE_PROPERTIES: 'visualmetadata/VISUAL_METADATA_UPDATE_FIELD_TITLE_PROPERTIES',
  VISUAL_METADATA_UPDATE_CHART_PROPERTIES: 'visualmetadata/VISUAL_METADATA_UPDATE_CHART_PROPERTIES',
  VISUAL_METADATA_UPDATE_DATA_PROPERTIES: 'visualmetadata/VISUAL_METADATA_UPDATE_DATA_PROPERTIES',
  VISUAL_METADATA_UPDATE_FIELD: 'visualmetadata/VISUAL_METADATA_UPDATE_FIELD',
  ADD_PINNED_FILTERS_INTO_VISUAL_METADATA: 'visualmetadata/ADD_PINNED_FILTERS_INTO_VISUAL_METADATA',
  REMOVE_PINNED_FILTERS_INTO_VISUAL_METADATA: 'visualmetadata/REMOVE_PINNED_FILTERS_INTO_VISUAL_METADATA',
  UPDATE_TABLE_PAGENO: 'UPDATE_TABLE_PAGENO',
  APPLY_ALTERNATE_DIMENSION: 'APPLY_ALTERNATE_DIMENSION',
  SET_DRAGGED_FEATURE: 'SET_DRAGGED_FEATURE',
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
  validateQueryResponse: queryValidationResponse as IQueryValidationResponse,
  filterData: {},
  selectedFilter: {},
  isEditMode: false,
  editAction: '',
  visualMetadataContainerList: [],
  tableActivePage: 0,
  visualisationAction: '',
  conditionExpression: null,
  isAlternateDimensionApplied: false,
  draggedFeature: null,
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
      return {
        ...state,
        updating: true,
        updateSuccess: false,
      };
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
      return {
        ...state,
        validateQueryResponse: queryValidationResponse,
      };
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
      return {
        ...state,
        updating: false,
        errorMessage: action.payload.data,
        updateSuccess: false,
      };
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
        validateQueryResponse: { ...queryValidationResponse, error: action.payload.message, validationResultType: 'FAILURE' },
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
        visualMetadataContainerList: visualMetadataContainerAdd(state.visualMetadataContainerList, action.payload.data),
      };
    case SUCCESS(ACTION_TYPES.UPDATE_VISUALMETADATA):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data,
        visualMetadataContainerList: visualMetadataContainerUpdate(
          state.visualMetadataContainerList,
          action.payload.data.id,
          action.payload.data,
          'id'
        ),
      };
    case SUCCESS(ACTION_TYPES.DELETE_VISUALMETADATA):
      return {
        ...state,
        updating: false,
        deleteSuccess: true,
        newCreated: false,
        visualMetadataContainerList: visualMetadataContainerRemove(state.visualMetadataContainerList, state.entity.id),
      };
    case SUCCESS(ACTION_TYPES.VALIDATE_QUERY):
      return {
        ...state,
        validateQueryResponse: action.payload.data,
      };
    case ACTION_TYPES.TOGGLE_EDIT_MODE:
      return {
        ...state,
        isEditMode: !state.isEditMode,
      };
    case ACTION_TYPES.SET_VISUAL:
      return {
        ...state,
        entity: action.payload,
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
    case ACTION_TYPES.VISUAL_METADATA_ADD_FIELD:
      return {
        ...state,
        entity: action.payload,
      };
    case ACTION_TYPES.VISUAL_METADATA_DELETE_FIELD:
      return {
        ...state,
        entity: action.payload,
      };
    case ACTION_TYPES.VISUAL_METADATA_SET_CONDITION_EXPRESSION:
      return {
        ...state,
        conditionExpression: action.payload,
      };
    case ACTION_TYPES.VISUAL_METADATA_UPDATE_FIELD_BODY_PROPERTIES:
      return {
        ...state,
        entity: updateVisualFieldBodyProperties(state.entity, action.payload),
      };
    case ACTION_TYPES.VISUAL_METADATA_UPDATE_DATA_PROPERTIES:
      return {
        ...state,
        entity: updateVisualDataProperties(state.entity, action.payload.property, action.payload.fieldName),
      };
    case ACTION_TYPES.VISUAL_METADATA_UPDATE_FIELD_TITLE_PROPERTIES:
      return {
        ...state,
        entity: updateVisualFieldTitleProperties(state.entity, action.payload),
      };
    case ACTION_TYPES.VISUAL_METADATA_UPDATE_CHART_PROPERTIES:
      return {
        ...state,
        entity: updateVisualChartProperties(state.entity, action.payload),
      };
    case ACTION_TYPES.VISUAL_METADATA_UPDATE_FIELD:
      return {
        ...state,
        entity: action.payload,
      };
    case ACTION_TYPES.UPDATE_TABLE_PAGENO:
      return {
        ...state,
        tableActivePage: action.payload,
      };
    case ACTION_TYPES.SET_VIZ_ACTION:
      return {
        ...state,
        visualisationAction: action.payload,
      };
    case ACTION_TYPES.APPLY_ALTERNATE_DIMENSION:
      return {
        ...state,
      };
    case ACTION_TYPES.ADD_PINNED_FILTERS_INTO_VISUAL_METADATA:
      return {
        ...state,
        visualMetadataContainerList: addPinnedFilters(state.visualMetadataContainerList, action.payload),
      };
    case ACTION_TYPES.REMOVE_PINNED_FILTERS_INTO_VISUAL_METADATA:
      return {
        ...state,
        visualMetadataContainerList: removePinnedFilters(state.visualMetadataContainerList),
      };
    case ACTION_TYPES.SET_DRAGGED_FEATURE:
      return {
        ...state,
        draggedFeature: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
        visualMetadataContainerList: [],
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
  return result;
};

export const toggleEditMode = () => ({
  type: ACTION_TYPES.TOGGLE_EDIT_MODE,
});

export const setVisual = v => ({
  type: ACTION_TYPES.SET_VISUAL,
  payload: v,
});

export const setEditAction = action => ({
  type: ACTION_TYPES.SET_EDIT_ACTION,
  payload: action,
});

export const setVisualisationAction = vizAction => ({
  type: ACTION_TYPES.SET_VIZ_ACTION,
  payload: vizAction,
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});

export const metadataContainerAdd = (visualMetadataContainerList: any, widget: any) => ({
  type: ACTION_TYPES.VISUAL_METADATA_CONTAINER_ADD,
  payload: visualMetadataContainerAdd(visualMetadataContainerList, widget),
});

export const metadataContainerRemove = (visualMetadataContainerList: any, id: string) => ({
  type: ACTION_TYPES.VISUAL_METADATA_CONTAINER_REMOVE,
  payload: visualMetadataContainerRemove(visualMetadataContainerList, id),
});

export const addPinnedFiltersIntoMetadataContainer = pinnedFeatures => ({
  type: ACTION_TYPES.ADD_PINNED_FILTERS_INTO_VISUAL_METADATA,
  payload: pinnedFeatures,
});

export const removePinnedFiltersIntoMetadataContainer = () => ({
  type: ACTION_TYPES.REMOVE_PINNED_FILTERS_INTO_VISUAL_METADATA,
});

export const metadataContainerUpdate = (visualMetadataContainerList: any, id: string, widget: any, key: string) => ({
  type: ACTION_TYPES.VISUAL_METADATA_CONTAINER_UPDATE,
  payload: visualMetadataContainerUpdate(visualMetadataContainerList, id, widget, key),
});

export const addField = (visual: IVisualMetadataSet, field) => ({
  type: ACTION_TYPES.VISUAL_METADATA_ADD_FIELD,
  payload: addVisualField(visual, field),
});

export const deleteField = (visual: IVisualMetadataSet, field) => ({
  type: ACTION_TYPES.VISUAL_METADATA_DELETE_FIELD,
  payload: deleteVisualField(visual, field),
});

export const updateFieldBodyProperties = bodyProperties => ({
  type: ACTION_TYPES.VISUAL_METADATA_UPDATE_FIELD_BODY_PROPERTIES,
  payload: bodyProperties,
});

export const updateFieldTitleProperties = titleProperties => ({
  type: ACTION_TYPES.VISUAL_METADATA_UPDATE_FIELD_TITLE_PROPERTIES,
  payload: titleProperties,
});

export const updateField = (visual: IVisualMetadataSet, field) => ({
  type: ACTION_TYPES.VISUAL_METADATA_UPDATE_FIELD,
  payload: updateVisualField(visual, field),
});

export const updateConditionExpression = conditionExpression => ({
  type: ACTION_TYPES.VISUAL_METADATA_SET_CONDITION_EXPRESSION,
  payload: conditionExpression,
});

export const setTableActivePage = (action: number) => dispatch => {
  dispatch({
    type: ACTION_TYPES.UPDATE_TABLE_PAGENO,
    payload: action,
  });
};

export const alternateDimension = (data: any, sendEvent) => {
  const visual = data.visualmetadata.visualMetadataSet.find(item => {
    return item.id === data.id;
  });
  visual.fields.map(item => {
    if (item.fieldType.featureType === DIMENSION) {
      item.feature.id = data.featureId;
      item.feature.name = data.featureName;
    }
  });
  getVisualisationData(sendEvent, visual, data.view, data.filter);
};

export const visualisationTablePagination = (data, sendEvent) => {
  const visual = data.visualmetadata.visualMetadataSet.find(item => {
    return item.id === data.visualizationId;
  });

  getVisualisationData(sendEvent, visual, data.view, data.filter, data.activePageNo);
};

export const applyAlternativeDimensionFilter = (dimension, visual, view, selectedFilters, sendEvent) => dispatch => {
  const fieldIndex = visual.fields.findIndex(item => item.feature.featureType === 'DIMENSION');
  if (fieldIndex > -1) {
    visual.fields[fieldIndex].feature = dimension;
  }
  getVisualisationData(sendEvent, visual, view, selectedFilters);
};

export const setDraggedFeature = feature => ({
  type: ACTION_TYPES.SET_DRAGGED_FEATURE,
  payload: feature,
});

export const updateChartProperties = property => ({
  type: ACTION_TYPES.VISUAL_METADATA_UPDATE_CHART_PROPERTIES,
  payload: property,
});

export const updateDataProperties = (property, fieldName) => ({
  type: ACTION_TYPES.VISUAL_METADATA_UPDATE_DATA_PROPERTIES,
  payload: { property, fieldName },
});

export const updateProperties = (property, propertyType, fieldName?) => dispatch => {
  if (propertyType === 'data') {
    dispatch(updateDataProperties(property, fieldName));
  } else {
    dispatch(updateChartProperties(property));
  }
};
