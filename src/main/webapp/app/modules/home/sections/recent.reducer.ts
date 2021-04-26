import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  FETCH_RECENTS_ACCESSED_VIEWS: 'recent/FETCH_RECENTS_ACCESSED_VIEWS',
  FETCH_POPULAR_VIEWS: 'recent/FETCH_POPULAR_VIEWS',
  FETCH_RECENTS_CREATED_VIEWS: 'recent/FETCH_RECENTS_CREATED_VIEWS',
};

const initialState = {
  loading: false,
  errorMessage: null,
  recentlyAccessedViews: [],
  popularViews: [],
  totalRecents: 0,
  recentlyCreatedViews: [],
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
    default:
      return state;
  }
};

export const getRecentViews = (page: number, size: number, sort: string) => ({
  type: ACTION_TYPES.FETCH_RECENTS_ACCESSED_VIEWS,
  payload: axios.get(`api/viewWatches?page=${page}&size=${size}&sort=${sort}`),
});

// TODO : action needs to be changed
export const getRecentlyAccessedBookmarks = (page: number, size: number, sort: string) => ({
  type: ACTION_TYPES.FETCH_POPULAR_VIEWS,
  payload: axios.get(`api/bookmark-watches?page=${page}&size=${size}&sort=${sort}`),
});

// TODO : action needs to be changed
export const getRecentlyCreatedBookmarks = (page: number, size: number, sort: string) => ({
  type: ACTION_TYPES.FETCH_POPULAR_VIEWS,
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
