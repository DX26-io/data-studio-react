import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';
import { generateOptions } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IBookmark, defaultValue } from 'app/shared/model/bookmark.model';

export const ACTION_TYPES = {
  FETCH_ROLES: 'bookmarks/FETCH_ROLES',
  FETCH_BOOKMARKS: 'bookmarks/FETCH_BOOKMARKS',
  FETCH_BOOKMARK: 'bookmarks/FETCH_BOOKMARK',
  CREATE_BOOKMARK: 'bookmarks/CREATE_BOOKMARK',
  UPDATE_BOOKMARK: 'bookmarks/UPDATE_BOOKMARK',
  DELETE_BOOKMARK: 'bookmarks/DELETE_BOOKMARK',
  // TODO:
  SEARCH_BOOKMARKS: 'bookmarks/SEARCH_BOOKMARKS',
  SET_BOOKMARK: 'bookmarks/SET_BOOKMARK',
  APPLY_BOOKMARK: 'bookmarks/APPLY_BOOKMARK',
  RESET: 'bookmarks/RESET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  bookmarks: [] as ReadonlyArray<IBookmark>,
  authorities: [] as any[],
  bookmark: defaultValue,
  appliedBookmark: null,
  updating: false,
  updateSuccess: false,
  fetchSuccess: false,
  totalItems: 0,
  searchedBookmarks: [] as ReadonlyArray<IBookmark>,
};

export type BookmarksState = Readonly<typeof initialState>;

// Reducer
export default (state: BookmarksState = initialState, action): BookmarksState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_ROLES):
      return {
        ...state,
      };
    case REQUEST(ACTION_TYPES.FETCH_BOOKMARKS):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.SEARCH_BOOKMARKS):
    case REQUEST(ACTION_TYPES.FETCH_BOOKMARK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true,
      };
    case REQUEST(ACTION_TYPES.CREATE_BOOKMARK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case REQUEST(ACTION_TYPES.UPDATE_BOOKMARK):
    case REQUEST(ACTION_TYPES.DELETE_BOOKMARK):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_BOOKMARKS):
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
      };
    case FAILURE(ACTION_TYPES.SEARCH_BOOKMARKS):
    case FAILURE(ACTION_TYPES.FETCH_BOOKMARK):
    case FAILURE(ACTION_TYPES.FETCH_ROLES):
    case FAILURE(ACTION_TYPES.CREATE_BOOKMARK):
      return {
        ...state,
        errorMessage: action.payload,
        updateSuccess: false,
        updating: false,
      };
    case FAILURE(ACTION_TYPES.UPDATE_BOOKMARK):
    case FAILURE(ACTION_TYPES.DELETE_BOOKMARK):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_ROLES):
      return {
        ...state,
        authorities: generateOptions(action.payload.data),
      };
    case SUCCESS(ACTION_TYPES.FETCH_BOOKMARKS):
      return {
        ...state,
        loading: false,
        bookmarks: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.SEARCH_BOOKMARKS):
      return {
        ...state,
        loading: false,
        searchedBookmarks: action.payload.data,
        totalItems: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case SUCCESS(ACTION_TYPES.FETCH_BOOKMARK):
      return {
        ...state,
        loading: false,
        bookmark: { ...action.payload.data, bookmarks: generateOptions(action.payload.data.bookmarks) },
        fetchSuccess: true,
      };
    case SUCCESS(ACTION_TYPES.CREATE_BOOKMARK):
      return {
        ...state,
        updateSuccess: true,
        errorMessage: null,
        updating: false,
      };
    case SUCCESS(ACTION_TYPES.UPDATE_BOOKMARK):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        bookmark: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.DELETE_BOOKMARK):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        bookmark: defaultValue,
      };
    case ACTION_TYPES.SET_BOOKMARK:
      return {
        ...state,
        bookmark: action.payload,
      };
    case ACTION_TYPES.APPLY_BOOKMARK:
      return {
        ...state,
        appliedBookmark: action.payload,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/feature-bookmarks';

export const getBookmarks: ICrudGetAllAction<IBookmark> = (datasourceId: number) => {
  const requestUrl = `${apiUrl}?datasource=${datasourceId}`;
  return {
    type: ACTION_TYPES.FETCH_BOOKMARKS,
    payload: axios.get<IBookmark>(requestUrl),
  };
};

export const getBookmark: ICrudGetAction<IBookmark> = name => {
  const requestUrl = `${apiUrl}/${name}`;
  return {
    type: ACTION_TYPES.FETCH_BOOKMARK,
    payload: axios.get<IBookmark>(requestUrl),
  };
};

export const createBookmark: ICrudPutAction<IBookmark> = bookmark => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_BOOKMARK,
    payload: axios.post(apiUrl, bookmark),
  });
  return result;
};

export const updateBookmark: ICrudPutAction<IBookmark> = bookmark => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_BOOKMARK,
    payload: axios.put(apiUrl, bookmark),
  });
  return result;
};

export const setBookmark = (bookmark: IBookmark) => {
  return {
    type: ACTION_TYPES.SET_BOOKMARK,
    payload: bookmark,
  };
};

export const applyBookmark = (bookmark: IBookmark) => {
  return {
    type: ACTION_TYPES.APPLY_BOOKMARK,
    payload: bookmark,
  };
};

export const deleteBookmark: ICrudDeleteAction<IBookmark> = name => async dispatch => {
  const requestUrl = `${apiUrl}/${name}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_BOOKMARK,
    payload: axios.delete(requestUrl),
  });
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
