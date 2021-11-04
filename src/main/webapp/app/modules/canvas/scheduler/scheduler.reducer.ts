import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';
import { cleanEntity, generateOptions } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IUser } from 'app/shared/model/user.model';
import {
  schedulerReportDefaultValue,
  ISchedulerReport,
  ConditionDefaultValue,
  TimeConditionsDefaultValue,
} from 'app/shared/model/scheduler-report.model';

export const ACTION_TYPES = {
  FETCH_USERS: 'scheduler/FETCH_USERS',
  SCHEDULE_REPORT: 'scheduler/SCHEDULE_REPORT',
  SET_SCHEDULER_REPORT: 'scheduler/SET_SCHEDULER_REPORT',
  FETCH_SCHEDULE_REPORT: 'scheduler/FETCH_SCHEDULE_REPORT',
  EXECUTE_NOW: 'scheduler/EXECUTE_NOW',
  CANCEL_SCHEDULE_REPORT: 'scheduler/CANCEL_SCHEDULE_REPORT',
  SET_CONDITION: 'scheduler/SET_CONDITION',
  SET_TIME_CONDITIONS: 'scheduler/SET_TIME_CONDITION',
  RESET: 'scheduler/RESET',
};

const initialState = {
  loading: false,
  message: null,
  schedulerReport: schedulerReportDefaultValue as ISchedulerReport,
  users: [] as ReadonlyArray<IUser>,
  condition: ConditionDefaultValue,
  timeConditions: TimeConditionsDefaultValue,
  updateSuccess: false,
  scheduleReportresponse: null,
  updating: false,
};

export type SchedulerState = Readonly<typeof initialState>;

// Reducer
export default (state: SchedulerState = initialState, action): SchedulerState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_USERS):
      return {
        ...state,
        message: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_USERS):
      return {
        ...state,
        loading: false,
        message: action.payload,
      };

    case SUCCESS(ACTION_TYPES.FETCH_USERS):
      return {
        ...state,
        loading: false,
        users: action.payload.data,
      };
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
        schedulerReport: action.payload.data.report ? action.payload.data.report : schedulerReportDefaultValue,
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
    case SUCCESS(ACTION_TYPES.EXECUTE_NOW):
      return {
        ...state,
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
        scheduleReportresponse: action.payload.data,
        updating: false,
      };
    case SUCCESS(ACTION_TYPES.CANCEL_SCHEDULE_REPORT):
      return {
        ...initialState,
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
    case ACTION_TYPES.RESET:
      return {
        ...state,
        loading: false,
        message: null,
        condition: ConditionDefaultValue,
        timeConditions: TimeConditionsDefaultValue,
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
    type: ACTION_TYPES.FETCH_SCHEDULE_REPORT,
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

export const reset = () => {
  return {
    type: ACTION_TYPES.RESET,
  };
};
