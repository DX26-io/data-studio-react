import { connectWebSocket, disconnectWebSocket, subscribeWebSocket } from 'app/shared/websocket/stomp-client.service';
import { getToken } from 'app/shared/reducers/authentication';
import { SearchAutoSuggestion } from 'app/entities/search/search.model';
import { searchCall } from 'app/shared/websocket/proxy-websocket.service';

export const ACTION_TYPES = {
  RESET: 'search/RESET',
  TOGGLE_SEARCH_MODAL: 'search/TOGGLE_SEARCH_MODAL',
  SET_SEARCH_RESPONSE: 'search/SET_SEARCH_RESPONSE',
  SET_SEARCH_TEXT: 'search/SET_SEARCH_TEXT',
  DO_SEARCH: 'search/DO_SEARCH',
  SET_SEARCH_ITEM_SELECTED_RESPONSE: 'search/SET_SEARCH_ITEM_SELECTED_RESPONSE',
  SET_SEARCH_ERROR: 'search/SET_SEARCH_ERROR',
};

const initialState = {
  isSearchOpen: false,
  searchError: null as string,
  searchText: '' as string,
  showResults: false,
  autoSuggestion: [] as ReadonlyArray<SearchAutoSuggestion>,
  searchStruct: {} as object,
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
        searchStruct: {},
      };
    case ACTION_TYPES.SET_SEARCH_RESPONSE:
      return {
        ...state,
        searchError: null,
        autoSuggestion: action.payload.autoSuggestion,
        searchStruct: action.payload.searchStruct,
      };
    case ACTION_TYPES.SET_SEARCH_ITEM_SELECTED_RESPONSE:
      return {
        ...state,
        searchError: null,
        searchText: action.payload.text,
      };
    case ACTION_TYPES.SET_SEARCH_TEXT:
      return {
        ...state,
        showResults: false,
        searchText: action.payload.text,
      };
    case ACTION_TYPES.DO_SEARCH:
      return {
        ...state,
        showResults: true,
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

export const setSearchItemSelectedResponse = (data: any) => ({
  type: ACTION_TYPES.SET_SEARCH_ITEM_SELECTED_RESPONSE,
  payload: data,
});

export const searchChange: (viewId: string, text: string) => void = (viewId, text) => dispatch => {
  searchCall(viewId, { text });
  dispatch({
    type: ACTION_TYPES.SET_SEARCH_TEXT,
    payload: { text },
  });
};

export const doSearch: (viewId: string, text: string) => void = (viewId, text) => dispatch => {
  searchCall(viewId, { text });
  dispatch({
    type: ACTION_TYPES.DO_SEARCH,
    payload: { text },
  });
};

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
    subscribeWebSocket('/user/exchange/search-item-selected', data => {
      const body = JSON.parse(data.body);
      dispatch(setSearchItemSelectedResponse(body));
    });
    subscribeWebSocket('/user/exchange/errors', error => {
      dispatch(setError(error));
    });
  });
};

export const disconnectSocket = () => {
  disconnectWebSocket();
};
