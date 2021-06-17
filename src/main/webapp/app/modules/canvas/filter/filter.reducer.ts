import { getVisualizationData, ValidateFields } from '../visualization/util/visualization-render-utils';
import { IViews } from 'app/shared/model/views.model';

export const ACTION_TYPES = {
  UPDATE_SELECTED_FILTER: 'filter/UPDATE_SELECTED_FILTER',
  TOGGLE_FILTER_PANEL: 'filter/TOGGLE_FILTER_PANEL',
  TOGGLE_FEATURES_PANEL: 'filter/TOGGLE_FEATURES_PANEL',
  SAVE_SELECTED_FILTER: 'filter/SAVE_SELECTED_FILTER',
};

const initialState = {
  isUpdateValueInFilter: false,
  isFeaturesPanelOpen: false,
  isFilterOpen: false,
  selectedFilters: {},
};

export type FilterState = Readonly<typeof initialState>;

// Reducer

export default (state: FilterState = initialState, action): FilterState => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_SELECTED_FILTER:
      return {
        ...state,
        isUpdateValueInFilter: !state.isUpdateValueInFilter,
        selectedFilters: state.selectedFilters,
      };
    case ACTION_TYPES.SAVE_SELECTED_FILTER:
      return {
        ...state,
        selectedFilters: action.payload,
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
    default:
      return state;
  }
};

const apiUrl = 'api/visualmetadata';

// Actions

export const updateSelectedFilter = () => ({
  type: ACTION_TYPES.UPDATE_SELECTED_FILTER,
});
export const saveSelectedFilter = (selectedFilter: any) => ({
  type: ACTION_TYPES.SAVE_SELECTED_FILTER,
  payload: selectedFilter,
});

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
    // @khushbu needs to make it generic
    // props.hideLoader(item.id);
  }
};

export const loadVisualization = (visualmetadata, view, filters) => {
  visualmetadata.visualMetadataSet.map((item, i) => {
    renderVisualizationById(item, view, filters);
  });
};

export const applyFilter = (filters: any, visualmetadata: any, view: IViews) => dispatch => {
  dispatch(saveSelectedFilter(filters));
  dispatch(updateSelectedFilter());
  loadVisualization(visualmetadata, view, filters);
};

export const clearFilter = (filters: any, visualmetadata: any, view: IViews) => dispatch => {
  dispatch(saveSelectedFilter({}));
  loadVisualization(visualmetadata, view, filters);
};
