import { connectWebSocket, subscribeWebSocket } from 'app/shared/websocket/stomp-client.service';
import { getToken } from 'app/shared/reducers/authentication';

export const ACTION_TYPES = {
  SET_VISUAL_DATA: 'visualData/SET_VISUAL_DATA',
  SET_VISUAL_ERROR: 'visualData/SET_VISUAL_ERROR',
  SET_CONNACTION_STATUS: 'visualData/SET_CONNACTION_STATUS',
};

const initialState = {
  loading: false,
  errorMessage: null,
  visualData: null,
  isSocketConnected: false,
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
    case ACTION_TYPES.SET_CONNACTION_STATUS:
      return {
        ...state,
        isSocketConnected: action.payload,
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

export const setVisualData = (visualData: any) => ({
  type: ACTION_TYPES.SET_VISUAL_DATA,
  payload: visualData,
});

export const setError = (error: string) => ({
  type: ACTION_TYPES.SET_VISUAL_ERROR,
  payload: error,
});

export const setSocketConnaction = (status: boolean) => ({
  type: ACTION_TYPES.SET_CONNACTION_STATUS,
  payload: status,
});

export const receiveSocketResponse = () => dispatch => {
  connectWebSocket({ token: getToken() }, function (frame) {
    dispatch(setSocketConnaction(true));
    subscribeWebSocket('/user/exchange/metaData', data => {
      const body = data.body === '' ? { data: [] } : JSON.parse(data.body);
      data.body = body.data;
      dispatch(setVisualData(data));
    });
    subscribeWebSocket('/user/exchange/metaDataError', error => {
      const body = JSON.parse(error.body || '{}');
      dispatch(setError(body));
    });
  });
};
