import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  FETCH_RECENTS_VIEWS: 'recent/FETCH_RECENTS_VIEWS',
  FETCH_POPULAR_VIEWS: 'recent/FETCH_POPULAR_VIEWS',
};

const initialState = {
  loading: false,
  errorMessage: null,
  recentViews: [],
  popularViews: [],
  totalRecents: 0,
};

export type RecentState = Readonly<typeof initialState>;

export default (state: RecentState = initialState, action): RecentState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_RECENTS_VIEWS):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_RECENTS_VIEWS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_RECENTS_VIEWS):
      return {
        ...state,
        loading: false,
        recentViews: action.payload.data,
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
  type: ACTION_TYPES.FETCH_RECENTS_VIEWS,
  payload: axios.get(`api/viewWatches?page=${page}&size=${size}&sort=${sort}`),
});

export const getRecentBookmarks = (page: number, size: number, sort: string) => ({
  type: ACTION_TYPES.FETCH_RECENTS_VIEWS,
  payload: axios.get(`api/bookmark-watches?page=${page}&size=${size}&sort=${sort}`),
});

export const getMostPopularViews = () => ({
  type: ACTION_TYPES.FETCH_POPULAR_VIEWS,
  payload: axios.get(`api/views/mostPopular`),
});

// export const getUserDashboardPermissions = (page: number, size: number, login: string) => ({
//   type: ACTION_TYPES.FETCH_DASHBOARD_PERMISSIONS,
//   payload: axios.get(`api/users/${login}/dashboardPermissions?page=${page}&size=${size}`),
// });

// export const getUserGroupViewsPermissions = (page: number, size: number, name: string, id: number) => ({
//   type: ACTION_TYPES.FETCH_VIEWS_PERMISSIONS,
//   payload: axios.get(`api/userGroups/${name}/dashboardPermissions/${id}/viewPermissions?page=${page}&size=${size}`),
// });

// export const getUserViewsPermissions = (page: number, size: number, login: string, id: number) => ({
//   type: ACTION_TYPES.FETCH_VIEWS_PERMISSIONS,
//   payload: axios.get(`api/users/${login}/dashboardPermissions/${id}/viewPermissions?page=${page}&size=${size}`),
// });

// export const updateUserGroupPermissions = (permissions: Array<IPermission>, name: string) => ({
//   type: ACTION_TYPES.UPDATE_PERMISSIONS,
//   payload: axios.put(`api/userGroups/${name}/changePermissions`, permissions),
// });

// export const updateUserPermissions = (permissions: Array<IPermission>, login: string) => ({
//   type: ACTION_TYPES.UPDATE_PERMISSIONS,
//   payload: axios.put(`api/users/${login}/changePermissions`, permissions),
// });

// export const resetViewsPermissions = () => ({
//   type: ACTION_TYPES.RESET_VIEWS_PERMISSIONS,
// });
