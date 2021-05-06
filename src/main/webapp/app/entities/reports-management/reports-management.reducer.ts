import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

export const ACTION_TYPES = {
  FETCH_REPORTS: 'reports/FETCH_REPORTS',
};

const initialState = {
  loading: false,
  errorMessage: null,
  reports: [],
  totalReports: 0,
};

export type ReportsManagementState = Readonly<typeof initialState>;

export default (state: ReportsManagementState = initialState, action): ReportsManagementState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_REPORTS):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_REPORTS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case SUCCESS(ACTION_TYPES.FETCH_REPORTS):
      return {
        ...state,
        loading: false,
        totalReports: action.payload.data.totalRecords,
        reports: action.payload.data.reports,
      };

    default:
      return state;
  }
};

const apiUrl = 'api/schedule/searchReports/';

export const fetchReports = (
  pageSize: number,
  page: number,
  userName?: string,
  reportName?: string,
  startDate?: string,
  endDate?: string,
  thresholdAlert?: boolean,
  dashboardName?: string,
  viewName?: string
) => dispatch => {
  userName = userName ? userName : '';
  reportName = reportName ? reportName : '';
  startDate = startDate ? startDate : '';
  endDate = endDate ? endDate : '';
  thresholdAlert = thresholdAlert ? thresholdAlert : false;
  dashboardName = dashboardName ? dashboardName : '';
  viewName = viewName ? viewName : '';
  dispatch({
    type: ACTION_TYPES.FETCH_REPORTS,
    payload: axios.get(
      `${apiUrl}?userName=${userName}&reportName=${reportName}&startDate=${startDate}&endDate=${endDate}&thresholdAlert=${thresholdAlert}&dashboardName=${dashboardName}&viewName=${viewName}&pageSize=${pageSize}&page=${page}`
    ),
  });
};
