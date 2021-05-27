import { connectWebSocket, disconnectWebSocket, subscribeWebSocket } from 'app/shared/websocket/stomp-client.service';
import { getToken } from 'app/shared/reducers/authentication';
import { SearchAutoSuggestion } from 'app/entities/search/search.model';

export const ACTION_TYPES = {
  RESET: 'search/RESET',
  TOGGLE_SEARCH_MODAL: 'search/TOGGLE_SEARCH_MODAL',
  SET_SEARCH_RESPONSE: 'search/SET_SEARCH_RESPONSE',
  SET_SEARCH_ERROR: 'search/SET_SEARCH_ERROR',
};

const initialState = {
  isSearchOpen: false,
  searchError: null as string,
  autoSuggestion: [] as ReadonlyArray<SearchAutoSuggestion>,
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
    case ACTION_TYPES.SET_SEARCH_ERROR:
      return {
        ...state,
        searchError: action.payload,
        autoSuggestion: [],
      };
    case ACTION_TYPES.SET_SEARCH_RESPONSE:
      return {
        ...state,
        searchError: null,
        autoSuggestion: action.payload.autoSuggestion,
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

export const setSearchResponse = (data: any) => ({
  type: ACTION_TYPES.SET_SEARCH_RESPONSE,
  payload: data,
});

export const setError = (error: string) => ({
  type: ACTION_TYPES.SET_SEARCH_ERROR,
  payload: error,
});

export const receiveSocketResponse = () => dispatch => {
  connectWebSocket({ token: getToken() }, () => {
    subscribeWebSocket('/user/exchange/search', data => {
      const body = JSON.parse(data.body);
      dispatch(setSearchResponse(body));
    });
    subscribeWebSocket('/user/exchange/errors', error => {
      dispatch(setError(error));
    });
  });
};

export const disconnectSocket = () => {
  disconnectWebSocket();
};
