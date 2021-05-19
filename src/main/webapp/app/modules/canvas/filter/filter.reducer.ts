import { FilterParameterService } from 'app/modules/canvas/filter/filter-parameters-service';

export const ACTION_TYPES = {
  UPDATE_SELECTED_FILTER: 'filter/UPDATE_SELECTED_FILTER',
  FILTER_STATE_CHANGE: 'filter/FILTER_STATE_CHANGE',
  TOGGLE_FILTER_PANEL: 'filter/TOGGLE_FILTER_PANEL',
  TOGGLE_FEATURES_PANEL: 'filter/TOGGLE_FEATURES_PANEL',
  SAVE_SELECTED_FILTER: 'filter/SAVE_SELECTED_FILTER',
  SAVE_FILTER: 'filter/SAVE_FILTER',
};

const initialState = {
  isUpdateValueInFilter: false,
  filterStateChange: false,
  isFeaturesPanelOpen: false,
  isFilterOpen: false,
  selectedFilters: {},
  paramObject: {},
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
    case ACTION_TYPES.FILTER_STATE_CHANGE:
      return {
        ...state,
        filterStateChange: !state.filterStateChange,
      };
    case ACTION_TYPES.SAVE_SELECTED_FILTER:
      return {
        ...state,
        selectedFilters: action.payload,
      };
    case ACTION_TYPES.SAVE_FILTER:
      return {
        ...state,
        paramObject: action.payload,
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

export const modifyFilterState = () => ({
  type: ACTION_TYPES.FILTER_STATE_CHANGE,
});

export const saveSelectedFilter = (selectedFilter: any) => ({
  type: ACTION_TYPES.SAVE_SELECTED_FILTER,
  payload: selectedFilter,
});

export const saveFilter = (newValue: any) => ({
  type: ACTION_TYPES.SAVE_FILTER,
  payload: newValue,
});

export const toggleFilterPanel = () => ({
  type: ACTION_TYPES.TOGGLE_FILTER_PANEL,
});

export const toggleFeaturesPanel: () => void = () => (dispatch, getState) => {
  dispatch({
    type: ACTION_TYPES.TOGGLE_FEATURES_PANEL,
  });
};
