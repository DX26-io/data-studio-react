import axios from 'axios';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { connectWebSocket, subscribeWebSocket } from 'app/shared/websocket/stomp-client.service';
import { getToken } from 'app/shared/reducers/authentication';

export const ACTION_TYPES = {
  SET_VISUAL_DATA: 'visualData/SET_VISUAL_DATA',
  SET_VISUAL_ERROR: 'visualData/SET_VISUAL_ERROR',
};

const initialState = {
  loading: false,
  errorMessage: null,
  visualData: [],
};

export type VisualDataState = Readonly<typeof initialState>;

export default (state: VisualDataState = initialState, action): VisualDataState => {
  switch (action.type) {
    case ACTION_TYPES.SET_VISUAL_DATA:
      return {
        ...state,
        loading: false,
        visualData: action.payload,
      };

    case ACTION_TYPES.SET_VISUAL_ERROR:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };

    default:
      return state;
  }
};

export const setVisualData = (visualData: Array<any>) => ({
  type: ACTION_TYPES.SET_VISUAL_DATA,
  payload: visualData,
});

export const setError = (error: string) => ({
  type: ACTION_TYPES.SET_VISUAL_ERROR,
  payload: error,
});

export const receiveSocketResponse = () => dispatch => {
  connectWebSocket({ token: getToken() }, function (frame) {
    subscribeWebSocket('/user/exchange/metaData', data => {
      const body = data.body === '' ? { data: [] } : JSON.parse(data.body);
      dispatch(setVisualData(body));
    });
    subscribeWebSocket('/user/exchange/metaDataError', error => {
      const body = JSON.parse(error.body || '{}');
      dispatch(setError(body));
    });
  });
};
