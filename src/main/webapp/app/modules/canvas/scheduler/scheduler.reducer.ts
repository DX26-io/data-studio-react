import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';
import { cleanEntity, generateOptions } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IUser } from 'app/shared/model/user.model';
import { defaultValue, ISchedule } from 'app/shared/model/schedule.model';

export const ACTION_TYPES = {
  FETCH_USERS: 'scheduler/FETCH_USERS',
  SCHEDULE_REPORT: 'scheduler/SCHEDULE_REPORT',
  FETCH_SCHEDULE_REPORT: 'scheduler/FETCH_SCHEDULE_REPORT',
  EXECUTE_NOW: 'scheduler/EXECUTE_NOW',
};

const initialState = {
  loading: false,
  errorMessage: null,
  scheduler: defaultValue,
  users: [] as ReadonlyArray<IUser>,
};

export type SchedulerState = Readonly<typeof initialState>;

// Reducer
export default (state: SchedulerState = initialState, action): SchedulerState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_USERS):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_USERS):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };

    case SUCCESS(ACTION_TYPES.FETCH_USERS):
      return {
        ...state,
        loading: false,
        users: action.payload.data,
      };
    case SUCCESS(ACTION_TYPES.FETCH_SCHEDULE_REPORT):
      return {
        ...state,
        loading: false,
        scheduler: action.payload.data.report,
      };
    case SUCCESS(ACTION_TYPES.SCHEDULE_REPORT):
      return {
        ...state,
        loading: false,
      };
    case SUCCESS(ACTION_TYPES.EXECUTE_NOW):
      return {
        ...state,
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

export const getScheduleReportById: ICrudGetAction<ISchedule> = id => {
  const requestUrl = `${apiUrlSchedule}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_SCHEDULE_REPORT,
    payload: axios.get<ISchedule>(requestUrl),
  };
};

export const scheduleReport: ICrudPutAction<ISchedule> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.SCHEDULE_REPORT,
    payload: axios.post(apiUrlSchedule, cleanEntity(entity)),
  });
  return result;
};

export const executeNow = id => {
  const requestUrl = `api/executeImmediate/${id}`;
  return {
    type: ACTION_TYPES.FETCH_SCHEDULE_REPORT,
    payload: axios.get<string>(requestUrl),
  };
};
