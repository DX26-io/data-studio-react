import { getVisualizationData, getVisualizationShareData, ValidateFields } from '../visualization/util/visualization-render-utils';
import { IViews } from 'app/shared/model/views.model';
import { toggleLoader } from 'app/shared/websocket/websocket.reducer';

export const ACTION_TYPES = {
  TOGGLE_FILTER_PANEL: 'filter/TOGGLE_FILTER_PANEL',
  TOGGLE_FEATURES_PANEL: 'filter/TOGGLE_FEATURES_PANEL',
  SAVE_SELECTED_FILTER: 'filter/SAVE_SELECTED_FILTER',
  ADD_SELECTED_FILTER_OPTIONS: 'filter/ADD_SELECTED_FILTER_OPTIONS',
  REMOVE_SELECTED_FILTER_OPTIONS: 'filter/REMOVE_SELECTED_FILTER_OPTIONS',
  SAVE_DYNAMIC_DATE_RANGEMETA_DATA: 'filter/SAVE_DYNAMIC_DATE_RANGEMETA_DATA',
  REMOVE_DATE_FILTER: 'filter/REMOVE_DATE_FILTER',
};

const initialState = {
  isFeaturesPanelOpen: false,
  isFilterOpen: false,
  selectedFilters: {},
  dynamicDateRangeMetaData: {},
};

const addOptionIntoFilters = (filter, filters, feature) => {
  // const filters = filters[feature.name] ? filters[feature.name.toLowerCase()] : filters[feature.name];
  if (filters[feature.name] && filters[feature.name].length > 0) {
    filters[feature.name].push(filter);
  } else {
    filters[feature.name] = [];
    filters[feature.name].push(filter);
  }
  filters[feature.name]._meta = {
    dataType: feature.type,
    valueType: 'valueType',
  };
  return Object.assign({}, filters);
};

const saveDateRangeData = (dynamicDateRangeMetaData: any, dimensionName: string, metaData: any) => {
  dynamicDateRangeMetaData[dimensionName] = metaData;
  return dynamicDateRangeMetaData;
};

export const removeOptionFromFilters = (filter, filters, feature) => {
  if (filters[feature.name] && filters[feature.name].length === 0) {
    delete filters[feature.name];
    return filters;
  } else {
    const index = filters[feature.name].findIndex(item => item === filter);
    if (index > -1) {
      filters[feature.name].splice(index, 1);
      if (filters[feature.name].length === 0) delete filters[feature.name];
    }
  }
  return Object.assign({}, filters);
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
        selectedFilters: addOptionIntoFilters(action.payload, state.selectedFilters, action.Meta),
      };
    case ACTION_TYPES.REMOVE_SELECTED_FILTER_OPTIONS:
      return {
        ...state,
        selectedFilters: removeOptionFromFilters(action.payload, state.selectedFilters, action.Meta),
      };
    case ACTION_TYPES.REMOVE_DATE_FILTER:
      return {
        ...state,
        selectedFilters: removeDateRangeFilters(state.selectedFilters, action.payload),
      };
    case ACTION_TYPES.SAVE_DYNAMIC_DATE_RANGEMETA_DATA:
      return {
        ...state,
        dynamicDateRangeMetaData: saveDateRangeData(state.dynamicDateRangeMetaData, action.payload, action.Meta),
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

const renderVisualizationById = (item, view, filters) => {
  if (ValidateFields(item.fields)) {
    getVisualizationData(item, view, filters);
  } else {
    toggleLoader(false);
  }
};

export const loadVisualization = (visualmetadata, view, filters) => {
  visualmetadata.visualMetadataSet.map((item, i) => {
    renderVisualizationById(item, view, filters);
  });
};

export const applyFilter = (filters: any, visualmetadata: any, view: IViews) => dispatch => {
  dispatch(saveSelectedFilter(filters));
  loadVisualization(visualmetadata, view, filters);
};

export const clearFilter = (filters: any, visualmetadata: any, view: IViews) => dispatch => {
  dispatch(saveSelectedFilter({}));
  loadVisualization(visualmetadata, view, filters);
};

export const addAppliedFilters = (filter, feature) => dispatch => {
  dispatch({
    type: ACTION_TYPES.ADD_SELECTED_FILTER_OPTIONS,
    payload: filter,
    Meta: feature,
  });
};
export const removeAppliedFilters = (filter, feature) => dispatch => {
  dispatch({
    type: ACTION_TYPES.REMOVE_SELECTED_FILTER_OPTIONS,
    payload: filter,
    Meta: feature,
  });
};

export const applyFilterForShareLink = (filters: any, visualmetadata: any, view: IViews) => dispatch => {
  dispatch(saveSelectedFilter(filters));
  getVisualizationShareData(visualmetadata, view, filters);
};

export const clearFilterForShareLink = (filters: any, visualmetadata: any, view: IViews) => dispatch => {
  dispatch(saveSelectedFilter({}));
  getVisualizationShareData(visualmetadata, view, filters);
};

export const removeDateFilters = (feature: string) => dispatch => {
  dispatch({
    type: ACTION_TYPES.REMOVE_DATE_FILTER,
    payload: feature,
  });
};

export const saveDynamicDateRangeMetaData = (dimensionName: string, metaData: any) => dispatch => {
  dispatch({
    type: ACTION_TYPES.SAVE_DYNAMIC_DATE_RANGEMETA_DATA,
    payload: dimensionName,
    Meta: metaData,
  });
};
