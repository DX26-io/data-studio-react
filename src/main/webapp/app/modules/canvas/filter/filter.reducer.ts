import { FilterParameterService } from 'app/modules/canvas/filter/filter-parameters-service';

export const ACTION_TYPES = {
  UPDATE_SELECTED_FILTER: 'visualmetadata/UPDATE_SELECTED_FILTER',
  FILTER_STATE_CHANGE: 'visualmetadata/FILTER_STATE_CHANGE',
};

const initialState = {
  selectedFilter: {},
  isUpdateValueInFilter: false,
  filterStateChange: false,
};

export type FilterState = Readonly<typeof initialState>;

// Reducer

export default (state: FilterState = initialState, action): FilterState => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_SELECTED_FILTER:
      return {
        ...state,
        isUpdateValueInFilter: !state.isUpdateValueInFilter,
        selectedFilter: FilterParameterService.getSelectedFilter(),
      };
    case ACTION_TYPES.FILTER_STATE_CHANGE:
      return {
        ...state,
        filterStateChange: !state.filterStateChange,
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
