import { getVisualisationData, getVisualisationShareData, ValidateFields } from '../visualisation/util/visualisation-render-utils';
import { IViews } from 'app/shared/model/views.model';
import { toggleLoader } from 'app/shared/websocket/websocket.reducer';
import { addOptionIntoFilters, removeOptionFromFilters, addDateRangeFilter, removeOptionsFromFilters } from './filter-util';
import { SEPARATORS } from 'app/shared/components/separator/separator.util';
import { resetTimezoneData } from 'app/shared/util/date-utils';

export const ACTION_TYPES = {
  TOGGLE_FILTER_PANEL: 'filter/TOGGLE_FILTER_PANEL',
  TOGGLE_FEATURES_PANEL: 'filter/TOGGLE_FEATURES_PANEL',
  SAVE_SELECTED_FILTER: 'filter/SAVE_SELECTED_FILTER',
  ADD_SELECTED_FILTER_OPTIONS: 'filter/ADD_SELECTED_FILTER_OPTIONS',
  REMOVE_SELECTED_FILTER_OPTIONS: 'filter/REMOVE_SELECTED_FILTER_OPTIONS',
  SAVE_DYNAMIC_DATE_RANGEMETA_DATA: 'filter/SAVE_DYNAMIC_DATE_RANGEMETA_DATA',
  REMOVE_DATE_FILTER: 'filter/REMOVE_DATE_FILTER',
  SET_SEPARATOR: 'filter/SET_SEPARATOR',
  RESET: 'filter/RESET',
  REMOVE_ALL_SELECTED_FILTER_OPTIONS: 'filter/REMOVE_ALL_SELECTED_FILTER_OPTIONS',
};

const initialState = {
  isFilterOpen: false,
  selectedFilters: {},
  dynamicDateRangeMetaData: {},
  separator: SEPARATORS[0].value,
};

const saveDateRangeData = (dynamicDateRangeMetaData: any, dimensionName: string, metaData: any) => {
  dynamicDateRangeMetaData[dimensionName] = metaData;
  return dynamicDateRangeMetaData;
};

export const removeDateRangeFilters = (filters, feature) => {
  delete filters[feature];
  return filters;
};

export type FilterState = Readonly<typeof initialState>;

// Reducer

export default (state: FilterState = initialState, action): FilterState => {
  switch (action.type) {
    case ACTION_TYPES.SAVE_SELECTED_FILTER:
      return {
        ...state,
        selectedFilters: { ...action.payload },
      };
    case ACTION_TYPES.TOGGLE_FILTER_PANEL:
      return {
        ...state,
        isFilterOpen: !state.isFilterOpen,
      };
    case ACTION_TYPES.ADD_SELECTED_FILTER_OPTIONS:
      return {
        ...state,
        selectedFilters: action.payload,
      };
    case ACTION_TYPES.REMOVE_SELECTED_FILTER_OPTIONS:
      return {
        ...state,
        selectedFilters: action.payload,
      };
    case ACTION_TYPES.REMOVE_ALL_SELECTED_FILTER_OPTIONS:
      return {
        ...state,
        selectedFilters: action.payload,
      };
    case ACTION_TYPES.REMOVE_DATE_FILTER:
      return {
        ...state,
        selectedFilters: removeDateRangeFilters(action.payload, action.Meta),
      };
    case ACTION_TYPES.SAVE_DYNAMIC_DATE_RANGEMETA_DATA:
      return {
        ...state,
        dynamicDateRangeMetaData: saveDateRangeData(state.dynamicDateRangeMetaData, action.payload, action.Meta),
      };
    case ACTION_TYPES.SET_SEPARATOR:
      return {
        ...state,
        separator: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...state,
        isFilterOpen: false,
        selectedFilters: {},
        dynamicDateRangeMetaData: {},
      };
    default:
      return state;
  }
};

export const saveSelectedFilter = (selectedFilter: any) => dispatch => {
  dispatch({
    type: ACTION_TYPES.SAVE_SELECTED_FILTER,
    payload: selectedFilter,
  });
};

export const toggleFilterPanel = () => ({
  type: ACTION_TYPES.TOGGLE_FILTER_PANEL,
});

const renderVisualisationById = (item, view, filters, sendEvent) => {
  if (ValidateFields(item.fields)) {
    getVisualisationData(sendEvent, item, view, filters);
  } else {
    toggleLoader(false);
  }
};

export const loadVisualisation = (visualmetadata, view, filters, sendEvent) => {
  visualmetadata.visualMetadataSet.map((item, i) => {
    renderVisualisationById(item, view, filters, sendEvent);
  });
};

export const applyFilter = (filters: any, visualmetadata: any, view: IViews, sendEvent: Function) => dispatch => {
  dispatch(saveSelectedFilter(filters));
  loadVisualisation(visualmetadata, view, filters, sendEvent);
};

export const clearFilter = (filters: any, visualmetadata: any, view: IViews, sendEvent: Function) => dispatch => {
  dispatch(saveSelectedFilter(filters));
  loadVisualisation(visualmetadata, view, filters, sendEvent);
};

export const addAppliedFilters = (filter, feature, view, visualmetaData, selectedFilter, sendEvent) => dispatch => {
  const _selectedFilter = addOptionIntoFilters(filter, selectedFilter, feature);
  dispatch({
    type: ACTION_TYPES.ADD_SELECTED_FILTER_OPTIONS,
    payload: _selectedFilter,
  });
  loadVisualisation(visualmetaData, view, _selectedFilter, sendEvent);
};
export const removeAppliedFilters = (sendEvent, filter, feature, view?, visualmetaData?, selectedFilter?) => dispatch => {
  const _selectedFilter = removeOptionFromFilters(filter, selectedFilter, feature);
  dispatch({
    type: ACTION_TYPES.REMOVE_SELECTED_FILTER_OPTIONS,
    payload: _selectedFilter,
  });
  loadVisualisation(visualmetaData, view, _selectedFilter, sendEvent);
};

export const removeAllSelectedOptionsAppliedFilters = (sendEvent, featureName, view?, visualmetaData?, selectedFilter?) => dispatch => {
  const _selectedFilter = removeOptionsFromFilters(selectedFilter, featureName);
  dispatch({
    type: ACTION_TYPES.REMOVE_ALL_SELECTED_FILTER_OPTIONS,
    payload: _selectedFilter,
  });
  loadVisualisation(visualmetaData, view, _selectedFilter, sendEvent);
};

export const applyFilterForShareLink = (sendEvent, filters: any, visualmetadata: any, view: IViews) => dispatch => {
  dispatch(saveSelectedFilter({}));
  getVisualisationShareData(sendEvent, visualmetadata, view, filters);
};

export const clearFilterForShareLink = (sendEvent: Function, filters: any, visualmetadata: any, view: IViews) => dispatch => {
  dispatch(saveSelectedFilter({}));
  getVisualisationShareData(sendEvent, visualmetadata, view, filters);
};

export const removeDateFilters = (filters, feature) => dispatch => {
  dispatch({
    type: ACTION_TYPES.REMOVE_DATE_FILTER,
    payload: filters,
    Meta: feature,
  });
};

export const saveDynamicDateRangeMetaData = (dimensionName: string, metaData: any) => dispatch => {
  dispatch({
    type: ACTION_TYPES.SAVE_DYNAMIC_DATE_RANGEMETA_DATA,
    payload: dimensionName,
    Meta: metaData,
  });
};

export const setSeparator = separator => dispatch => {
  dispatch({
    type: ACTION_TYPES.SET_SEPARATOR,
    payload: separator,
  });
};

export const onDateRangeFilterChange = (
  selectedFilters,
  feature,
  startDate,
  endDate,
  metaData,
  view,
  visualmetadata,
  sendEvent
) => dispatch => {
  selectedFilters[feature.name] = [];
  if (startDate && endDate) {
    dispatch(saveDynamicDateRangeMetaData(feature.name, metaData));
    dispatch(saveSelectedFilter(selectedFilters));
    startDate = resetTimezoneData(startDate);
    endDate = resetTimezoneData(endDate);
    dispatch(saveSelectedFilter(addDateRangeFilter(feature, startDate, endDate, selectedFilters)));
  } else {
    dispatch(removeDateFilters(selectedFilters, feature.name));
  }
  dispatch(applyFilter(selectedFilters, visualmetadata, view, sendEvent));
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
