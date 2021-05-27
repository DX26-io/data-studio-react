import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';
import { cleanEntity, generateOptions } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { IUser, defaultValue } from 'app/shared/model/user.model';

export const ACTION_TYPES = {
  FETCH_WEBHOOK: 'notification/FETCH_WEBHOOK',
};

const initialState = {
  loading: false,
  errorMessage: null,
  webHooks: [] as ReadonlyArray<any>,
};

export type notificationState = Readonly<typeof initialState>;

// Reducer
export default (state: notificationState = initialState, action): notificationState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_WEBHOOK):
      return {
        ...state,
        errorMessage: null,
        loading: true,
      };
    case FAILURE(ACTION_TYPES.FETCH_WEBHOOK):
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };

    case SUCCESS(ACTION_TYPES.FETCH_WEBHOOK):
      return {
        ...state,
        loading: false,
        webHooks: action.payload.data,
      };
    default:
      return state;
  }
};

const apiUrl = 'api/notification';
// Actions

export const getWebhookList: ICrudGetAllAction<any> = () => {
  const requestUrl = `${apiUrl}/getTeamConfig/?id=0`;
  return {
    type: ACTION_TYPES.FETCH_WEBHOOK,
    payload: axios.get<any>(requestUrl),
  };
};
