import axios from 'axios';
import { ICrudDeleteAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { FAILURE, REQUEST, SUCCESS } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  REQUEST_RELEASE: 'releases/REQUEST_RELEASE',
  APPROVE_REQUEST_RELEASE: 'releases/APPROVE_REQUEST_RELEASE',
  DISAPPROVE_REQUEST_RELEASE: 'releases/DISAPPROVE_REQUEST_RELEASE',
  SET_DASHBOARD_REQUEST_RELEASE: 'releases/SET_DASHBOARD_REQUEST_RELEASE',
};

// this is used in releasing dashboard only hence model is not required
const _dashboardReleaseRequest = { comment: '', viewIds: [] };

const initialState = {
  loading: false,
  errorMessage: null,
  releases: [],
  updating: false,
  totalItems: 0,
  updateSuccess: false,
  dashboardReleaseRequest: _dashboardReleaseRequest,
};

export type ReleasesState = Readonly<typeof initialState>;

// Reducer

export default (state: ReleasesState = initialState, action): ReleasesState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.APPROVE_REQUEST_RELEASE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.APPROVE_REQUEST_RELEASE):
      return {
        ...state,
        errorMessage: action.payload,
        updateSuccess: false,
        updating: false,
      };
    case SUCCESS(ACTION_TYPES.APPROVE_REQUEST_RELEASE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: true,
        updating: false,
      };
    case REQUEST(ACTION_TYPES.DISAPPROVE_REQUEST_RELEASE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.DISAPPROVE_REQUEST_RELEASE):
      return {
        ...state,
        errorMessage: action.payload,
        updateSuccess: false,
        updating: false,
      };
    case SUCCESS(ACTION_TYPES.DISAPPROVE_REQUEST_RELEASE):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: true,
        updating: false,
      };
    case REQUEST(ACTION_TYPES.REQUEST_RELEASE):
      return {
        ...state,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.REQUEST_RELEASE):
      return {
        ...state,
        errorMessage: action.payload,
        loading: false,
      };
    case SUCCESS(ACTION_TYPES.REQUEST_RELEASE):
      return {
        ...state,
        releases: action.payload.data,
        loading: false,
      };
    case ACTION_TYPES.SET_DASHBOARD_REQUEST_RELEASE:
      return {
        ...state,
        dashboardReleaseRequest: action.payload,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/releases';

export const getReleases = () => ({
  type: ACTION_TYPES.REQUEST_RELEASE,
  payload: axios.get(`${apiUrl}`),
});

export const approveRelease = releaseId => ({
  type: ACTION_TYPES.APPROVE_REQUEST_RELEASE,
  payload: axios.put(`${apiUrl}/${releaseId}/approve`),
});

export const disApproveRelease = releaseId => ({
  type: ACTION_TYPES.DISAPPROVE_REQUEST_RELEASE,
  payload: axios.put(`${apiUrl}/${releaseId}/reject`),
});

export const setDashboardReleaseRequest = release => ({
  type: ACTION_TYPES.SET_DASHBOARD_REQUEST_RELEASE,
  payload: release,
});
