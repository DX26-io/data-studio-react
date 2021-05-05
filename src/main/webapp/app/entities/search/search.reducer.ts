import axios from 'axios';

export const ACTION_TYPES = {
  RESET: 'search/RESET',
  TOGGLE_SEARCH_MODAL: 'search/TOGGLE_SEARCH_MODAL',
};

const initialState = {
  isSearchOpen: false,
};

export type SearchState = Readonly<typeof initialState>;

export default (state: SearchState = initialState, action): SearchState => {
  switch (action.type) {
    case ACTION_TYPES.RESET:
      return {
        ...state,
        isSearchOpen: false,
      };
    case ACTION_TYPES.TOGGLE_SEARCH_MODAL:
      return {
        ...state,
        isSearchOpen: !state.isSearchOpen,
      };
    default:
      return state;
  }
};

export const toggleSearch: () => void = () => dispatch => {
  dispatch({
    type: ACTION_TYPES.TOGGLE_SEARCH_MODAL,
  });
};

export const resetSearch: () => void = () => dispatch => {
  dispatch({
    type: ACTION_TYPES.RESET,
  });
};
