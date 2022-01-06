import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction, translate } from 'react-jhipster';
import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IUser } from 'app/shared/model/user.model';
import {
  schedulerReportDefaultValue,
  ISchedulerReport,
  conditionDefaultValue,
  timeConditionsDefaultValue,
} from 'app/shared/model/scheduler-report.model';
import { buildCondition, buildTimeConditions } from './scheduler.util';
import { IError, defaultValue } from 'app/shared/model/error.model';
export const ACTION_TYPES = {
  FETCH_USERS: 'scheduler/FETCH_USERS',
  SCHEDULE_REPORT: 'scheduler/SCHEDULE_REPORT',
  SET_SCHEDULER_REPORT: 'scheduler/SET_SCHEDULER_REPORT',
  FETCH_SCHEDULE_REPORT: 'scheduler/FETCH_SCHEDULE_REPORT',
  EXECUTE_NOW: 'scheduler/EXECUTE_NOW',
  CANCEL_SCHEDULE_REPORT: 'scheduler/CANCEL_SCHEDULE_REPORT',
  SET_CONDITION: 'scheduler/SET_CONDITION',
  SET_TIME_CONDITIONS: 'scheduler/SET_TIME_CONDITION',
  SET_TIME_COMPATIBLE_DIMENSIONS: 'scheduler/SET_TIME_COMPATIBLE_DIMENSIONS',
  RESET: 'scheduler/RESET',
  SET_ERROR_MESSAGE: 'scheduler/SET_ERROR_MESSAGE',
};

const initialState = {
  loading: false,
  errorMessage: defaultValue as IError,
  schedulerReport: schedulerReportDefaultValue as ISchedulerReport,
  condition: conditionDefaultValue,
  timeConditions: timeConditionsDefaultValue,
  updateSuccess: false,
  scheduleReportresponse: null,
  updating: false,
  timeCompatibleDimensions: null,
  reportExecuting: false,
};

export type SchedulerState = Readonly<typeof initialState>;

// Reducer
export default (state: SchedulerState = initialState, action): SchedulerState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_SCHEDULE_REPORT):
      return {
        ...state,
        loading: true,
        scheduleReportresponse: null,
      };
    case FAILURE(ACTION_TYPES.FETCH_SCHEDULE_REPORT):
      return {
        ...state,
        loading: false,
        scheduleReportresponse: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_SCHEDULE_REPORT):
      return {
        ...state,
        loading: false,
        scheduleReportresponse: action.payload.data.report ? null : action.payload.data,
        schedulerReport: action.payload.data.report ? action.payload.data.report : schedulerReportDefaultValue,
        timeConditions:
          action.payload.data.report && action.payload.data.report.report.thresholdAlert
            ? buildTimeConditions(JSON.parse(action.payload.data.report.constraints).time)
            : timeConditionsDefaultValue,
        condition:
          action.payload.data.report && action.payload.data.report.report.thresholdAlert
            ? buildCondition(JSON.parse(action.payload.data.report.query))
            : conditionDefaultValue,
      };
    case REQUEST(ACTION_TYPES.SCHEDULE_REPORT):
      return {
        ...state,
        updateSuccess: false,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.SCHEDULE_REPORT):
      return {
        ...state,
        updateSuccess: false,
        scheduleReportresponse: action.payload.data,
        updating: false,
      };
    case SUCCESS(ACTION_TYPES.SCHEDULE_REPORT):
      return {
        ...state,
        updateSuccess: true,
        scheduleReportresponse: action.payload.data,
        updating: false,
      };
    case REQUEST(ACTION_TYPES.EXECUTE_NOW):
      return {
        ...state,
        reportExecuting: true,
      };
    case FAILURE(ACTION_TYPES.EXECUTE_NOW):
      return {
        ...state,
        reportExecuting: false,
      };
    case SUCCESS(ACTION_TYPES.EXECUTE_NOW):
      return {
        ...state,
        reportExecuting: false,
        scheduleReportresponse: { message: translate('reportsManagement.reports.executeNowMessage') },
      };
    case ACTION_TYPES.SET_SCHEDULER_REPORT:
      return {
        ...state,
        schedulerReport: action.payload,
      };
    case REQUEST(ACTION_TYPES.CANCEL_SCHEDULE_REPORT):
      return {
        ...state,
        updating: true,
      };
    case FAILURE(ACTION_TYPES.CANCEL_SCHEDULE_REPORT):
      return {
        ...state,
        updating: false,
      };
    case SUCCESS(ACTION_TYPES.CANCEL_SCHEDULE_REPORT):
      return {
        ...state,
        updating: false,
        scheduleReportresponse: { message: translate('reportsManagement.reports.cancelledMessage')},
        errorMessage: {
          translationKey: '',
          isValid: true,
        },
        schedulerReport: {
          datasourceId: '',
          dashboardId: '',
          report: {
            userId: '',
            connectionName: '',
            reportName: '',
            sourceId: 0,
            subject: '',
            titleName: '',
            mailBody: '',
            dashboardName: '',
            viewName: '',
            viewId: '',
            shareLink: '',
            buildUrl: '',
            thresholdAlert: true,
            createdDate: '',
          },
          queryDTO: {},
          constraints: '{}',
          putCall: false,
          emailReporter: false,
          reportLineItem: {
            visualizationId: '',
            visualisationType: '',
            dimensions: [],
            measures: [],
          },
          schedule: {
            cronExp: '10 4 11 * *',
            timezone: '',
            startDate: new Date(),
            endDate: new Date(),
          },
          assignReport: {
            channels: [],
            communicationList: { emails: [], teams: [] },
          },
        },
        condition: {
          thresholdMode: 'absolute',
          featureName: { label: null, value: null },
          value: null,
          compare: {
            value: '',
          },
          dynamicThreshold: {
            aggregation: { label: null, value: null },
            dimension: { definition: { label: null, value: null } },
            unit: { label: null, value: null },
            value: null,
          },
        },
        timeConditions: { unit: { label: null, value: null }, value: null, feature: { definition: { label: null, value: null } } },
      };
    case ACTION_TYPES.SET_CONDITION:
      return {
        ...state,
        condition: action.payload,
      };
    case ACTION_TYPES.SET_TIME_CONDITIONS:
      return {
        ...state,
        timeConditions: action.payload,
      };
    case ACTION_TYPES.SET_TIME_COMPATIBLE_DIMENSIONS:
      return {
        ...state,
        timeCompatibleDimensions: action.payload,
      };
    case ACTION_TYPES.SET_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...state,
        loading: false,
        updateSuccess: false,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/users';
const apiUrlSchedule = 'api/schedule';
// Actions
export const getUsers: ICrudGetAllAction<IUser> = () => {
  const requestUrl = `${apiUrl}/search`;
  return {
    type: ACTION_TYPES.FETCH_USERS,
    payload: axios.get<IUser>(requestUrl),
  };
};

export const getScheduleReportById: ICrudGetAction<ISchedulerReport> = id => {
  const requestUrl = `${apiUrlSchedule}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_SCHEDULE_REPORT,
    payload: axios.get<ISchedulerReport>(requestUrl),
  };
};

export const scheduleReport: ICrudPutAction<ISchedulerReport> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.SCHEDULE_REPORT,
    payload: axios.post(apiUrlSchedule, cleanEntity(entity)),
  });
  return result;
};

export const setSchedulerReport = (schedulerReport: ISchedulerReport) => ({
  type: ACTION_TYPES.SET_SCHEDULER_REPORT,
  payload: schedulerReport,
});

export const executeNow = id => {
  const requestUrl = `api/executeImmediate/${id}`;
  return {
    type: ACTION_TYPES.EXECUTE_NOW,
    payload: axios.get<string>(requestUrl),
  };
};

export const cancelScheduleReport = id => {
  const requestUrl = `${apiUrlSchedule}/${id}`;
  return {
    type: ACTION_TYPES.CANCEL_SCHEDULE_REPORT,
    payload: axios.delete(requestUrl),
  };
};

export const setConditions = condition => {
  return {
    type: ACTION_TYPES.SET_CONDITION,
    payload: condition,
  };
};

export const setTimeConditions = timeConditions => {
  return {
    type: ACTION_TYPES.SET_TIME_CONDITIONS,
    payload: timeConditions,
  };
};

export const setTimeCompatibleDimensions = timeCompatibleDimensions => {
  return {
    type: ACTION_TYPES.SET_TIME_COMPATIBLE_DIMENSIONS,
    payload: timeCompatibleDimensions,
  };
};

export const setErrorMessage = error => {
  return {
    type: ACTION_TYPES.SET_ERROR_MESSAGE,
    payload: error,
  };
};

export const reset = () => {
  return {
    type: ACTION_TYPES.RESET,
  };
};
