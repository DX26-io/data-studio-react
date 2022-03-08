import { getVisualisationData, getVisualisationShareData, ValidateFields } from '../visualisation/util/visualisation-render-utils';
import { IViews } from 'app/shared/model/views.model';
import { toggleLoader } from 'app/shared/websocket/websocket.reducer';
import { addOptionIntoFilters, removeOptionFromFilters } from './filter-util';
import { SEPARATORS } from 'app/shared/components/separator/separator.util';

export const ACTION_TYPES = {
  TOGGLE_FILTER_PANEL: 'filter/TOGGLE_FILTER_PANEL',
  TOGGLE_FEATURES_PANEL: 'filter/TOGGLE_FEATURES_PANEL',
  SAVE_SELECTED_FILTER: 'filter/SAVE_SELECTED_FILTER',
  ADD_SELECTED_FILTER_OPTIONS: 'filter/ADD_SELECTED_FILTER_OPTIONS',
  REMOVE_SELECTED_FILTER_OPTIONS: 'filter/REMOVE_SELECTED_FILTER_OPTIONS',
  SAVE_DYNAMIC_DATE_RANGEMETA_DATA: 'filter/SAVE_DYNAMIC_DATE_RANGEMETA_DATA',
  REMOVE_DATE_FILTER: 'filter/REMOVE_DATE_FILTER',
  SET_SEPARATOR: 'filter/SET_SEPARATOR',
};

const initialState = {
  isFeaturesPanelOpen: false,
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
        isFeaturesPanelOpen: state.isFeaturesPanelOpen && !state.isFilterOpen,
      };
    case ACTION_TYPES.TOGGLE_FEATURES_PANEL:
      return {
        ...state,
        isFeaturesPanelOpen: !state.isFeaturesPanelOpen,
        isFilterOpen: state.isFilterOpen && !state.isFeaturesPanelOpen,
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

export const toggleFeaturesPanel: () => void = () => (dispatch, getState) => {
  dispatch({
    type: ACTION_TYPES.TOGGLE_FEATURES_PANEL,
  });
};

const renderVisualisationById = (item, view, filters) => {
  if (ValidateFields(item.fields)) {
    getVisualisationData(item, view, filters);
  } else {
    toggleLoader(false);
  }
};

export const loadVisualisation = (visualmetadata, view, filters) => {
  visualmetadata.visualMetadataSet.map((item, i) => {
    renderVisualisationById(item, view, filters);
  });
};

export const applyFilter = (filters: any, visualmetadata: any, view: IViews) => dispatch => {
  dispatch(saveSelectedFilter(filters));
  loadVisualisation(visualmetadata, view, filters);
};

export const clearFilter = (filters: any, visualmetadata: any, view: IViews) => dispatch => {
  dispatch(saveSelectedFilter(filters));
  loadVisualisation(visualmetadata, view, filters);
};

export const addAppliedFilters = (filter, feature, view, visualmetaData, selectedFilter) => dispatch => {
  const _selectedFilter = addOptionIntoFilters(filter, selectedFilter, feature);
  dispatch({
    type: ACTION_TYPES.ADD_SELECTED_FILTER_OPTIONS,
    payload: _selectedFilter,
  });
  loadVisualisation(visualmetaData, view, _selectedFilter);
};
export const removeAppliedFilters = (filter, feature, view?, visualmetaData?, selectedFilter?) => dispatch => {
  const _selectedFilter = removeOptionFromFilters(filter, selectedFilter, feature);
  dispatch({
    type: ACTION_TYPES.REMOVE_SELECTED_FILTER_OPTIONS,
    payload: _selectedFilter,
  });
  loadVisualisation(visualmetaData, view, _selectedFilter);
};

export const applyFilterForShareLink = (filters: any, visualmetadata: any, view: IViews) => dispatch => {
  dispatch(saveSelectedFilter({}));
  getVisualisationShareData(visualmetadata, view, filters);
};

export const clearFilterForShareLink = (filters: any, visualmetadata: any, view: IViews) => dispatch => {
  dispatch(saveSelectedFilter({}));
  getVisualisationShareData(visualmetadata, view, filters);
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
