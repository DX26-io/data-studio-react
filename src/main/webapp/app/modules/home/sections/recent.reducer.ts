import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  FETCH_RECENTS_ACCESSED_VIEWS: 'recent/FETCH_RECENTS_ACCESSED_VIEWS',
  FETCH_POPULAR_VIEWS: 'recent/FETCH_POPULAR_VIEWS',
  FETCH_RECENTS_CREATED_VIEWS: 'recent/FETCH_RECENTS_CREATED_VIEWS',
  FETCH_RECENTS_ACCESSED_BOOKMARKS: 'recent/FETCH_RECENTS_ACCESSED_BOOKMARKS',
  FETCH_RECENTS_CREATED_BOOKMARKS: 'recent/FETCH_RECENTS_CREATED_BOOKMARKS',
  SAVE_RECENTS_BOOKMARK: 'recent/SAVE_RECENTS_BOOKMARK',
};

const initialState = {
  loading: false,
  errorMessage: null,
  recentlyAccessedViews: [],
  popularViews: [],
  totalRecents: 0,
  recentlyCreatedViews: [],
  recentlyAccessedBookmarks: [],
  recentlyCreatedBookmarks: [],
};

export type RecentState = Readonly<typeof initialState>;

export default (state: RecentState = initialState, action): RecentState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_RECENTS_ACCESSED_VIEWS):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_RECENTS_ACCESSED_VIEWS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_RECENTS_ACCESSED_VIEWS):
      return {
        ...state,
        loading: false,
        recentlyAccessedViews: action.payload.data,
        totalRecents: parseInt(action.payload.headers['x-total-count'], 10),
      };

    case REQUEST(ACTION_TYPES.FETCH_RECENTS_CREATED_VIEWS):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_RECENTS_CREATED_VIEWS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_RECENTS_CREATED_VIEWS):
      return {
        ...state,
        loading: false,
        recentlyCreatedViews: action.payload.data,
        totalRecents: parseInt(action.payload.headers['x-total-count'], 10),
      };

    case REQUEST(ACTION_TYPES.FETCH_POPULAR_VIEWS):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_POPULAR_VIEWS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_POPULAR_VIEWS):
      return {
        ...state,
        loading: false,
        popularViews: action.payload.data,
        totalRecents: parseInt(action.payload.headers['x-total-count'], 10),
      };

    case REQUEST(ACTION_TYPES.FETCH_RECENTS_ACCESSED_BOOKMARKS):
      return {
        ...state,
        recentlyAccessedBookmarks: [],
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_RECENTS_ACCESSED_BOOKMARKS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_RECENTS_ACCESSED_BOOKMARKS):
      return {
        ...state,
        loading: false,
        recentlyAccessedBookmarks: action.payload.data,
        totalRecents: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case REQUEST(ACTION_TYPES.FETCH_RECENTS_CREATED_BOOKMARKS):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_RECENTS_CREATED_BOOKMARKS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_RECENTS_CREATED_BOOKMARKS):
      return {
        ...state,
        loading: false,
        recentlyCreatedBookmarks: action.payload.data,
        totalRecents: parseInt(action.payload.headers['x-total-count'], 10),
      };
    case REQUEST(ACTION_TYPES.SAVE_RECENTS_BOOKMARK):
    case FAILURE(ACTION_TYPES.SAVE_RECENTS_BOOKMARK):
    case SUCCESS(ACTION_TYPES.SAVE_RECENTS_BOOKMARK):
    default:
      return state;
  }
};

export const getRecentViews = (page: number, size: number, sort: string) => ({
  type: ACTION_TYPES.FETCH_RECENTS_ACCESSED_VIEWS,
  payload: axios.get(`api/viewWatches?page=${page}&size=${size}&sort=${sort}`),
});

export const getRecentlyAccessedBookmarks = (page: number, size: number, sort: string) => ({
  type: ACTION_TYPES.FETCH_RECENTS_ACCESSED_BOOKMARKS,
  payload: axios.get(`api/bookmark-watches?page=${page}&size=${size}&sort=${sort}`),
});

export const getRecentlyCreatedBookmarks = (page: number, size: number, sort: string) => ({
  type: ACTION_TYPES.FETCH_RECENTS_CREATED_BOOKMARKS,
  payload: axios.get(`api/bookmark-watches?page=${page}&size=${size}&sort=${sort}`),
});

export const getMostPopularViews = () => ({
  type: ACTION_TYPES.FETCH_POPULAR_VIEWS,
  payload: axios.get(`api/views/mostPopular`),
});

export const getRecentlyCreatedViews = () => ({
  type: ACTION_TYPES.FETCH_RECENTS_CREATED_VIEWS,
  payload: axios.get(`api/views/recentlyCreated`),
});

export const saveRecentBookmark = (bookmarkId, viewId) => ({
  type: ACTION_TYPES.SAVE_RECENTS_BOOKMARK,
  payload: axios.get(`api/save-recent-bookmark/${bookmarkId}/${viewId}`),
});
