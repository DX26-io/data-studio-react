import { getToken } from 'app/shared/reducers/authentication';

export const ACTION_TYPES = {
  SET_VISUAL_DATA: 'visualData/SET_VISUAL_DATA',
  SET_FILTER_DATA: 'visualData/SET_FILTER_DATA',
  SET_VISUAL_DATA_BY_ID: 'visualData/SET_VISUAL_DATA_BY_ID',
  SET_VISUAL_ERROR: 'visualData/SET_VISUAL_ERROR',
  TOGGLE_LOADER: 'visualData/TOGGLE_LOADER',
  TOGGLE_LOADING: 'visualData/TOGGLE_LOADING',
  RESET: 'visualData/RESET',
  DISPATCH_SEND_SOCKET: 'visualData/DISPATCH_SEND_SOCKET',
};

const initialState = {
  loading: false,
  errorMessage: null,
  visualData: { data: [], queryId: '' },
  isLoaderOn: false,
  visualDataById: null,
  filterData: null,
  sendEvent: (fbiEngineDTO: any, datasourceId: number, viewId?) => void {},
};

export type VisualDataState = Readonly<typeof initialState>;

export default (state: VisualDataState = initialState, action): VisualDataState => {
  switch (action.type) {
    case ACTION_TYPES.SET_VISUAL_DATA:
      return {
        ...state,
        isLoaderOn: false,
        loading: false,
        visualData: action.payload,
      };
    case ACTION_TYPES.SET_VISUAL_DATA_BY_ID:
      return {
        ...state,
        loading: false,
        visualDataById: action.payload,
      };
    case ACTION_TYPES.SET_FILTER_DATA:
      return {
        ...state,
        loading: false,
        filterData: action.payload,
      };
    case ACTION_TYPES.SET_VISUAL_ERROR:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
      };
    case ACTION_TYPES.TOGGLE_LOADER:
      return {
        ...state,
        isLoaderOn: action.payload,
        loading: action.payload,
      };
    case ACTION_TYPES.DISPATCH_SEND_SOCKET:
      return {
        ...state,
        sendEvent: action.fun,
      };
    case ACTION_TYPES.TOGGLE_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const setVisualData = (visualData: any) => ({
  type: ACTION_TYPES.SET_VISUAL_DATA,
  payload: visualData,
});

export const setVisualDataById = (visualDataById: any) => ({
  type: ACTION_TYPES.SET_VISUAL_DATA_BY_ID,
  payload: visualDataById,
});

export const setFilterData = (filterData: any) => ({
  type: ACTION_TYPES.SET_FILTER_DATA,
  payload: filterData,
});

export const setError = (error: string) => ({
  type: ACTION_TYPES.SET_VISUAL_ERROR,
  payload: error,
});

export const toggleLoader = (isLoaderOn: boolean) => ({
  type: ACTION_TYPES.TOGGLE_LOADER,
  payload: isLoaderOn,
});

export const toggleLoading = (loading: boolean) => ({
  type: ACTION_TYPES.TOGGLE_LOADING,
  payload: loading,
});

export const dispatchSendEvent = (sendEvent: Function) => ({
  type: ACTION_TYPES.DISPATCH_SEND_SOCKET,
  fun: sendEvent,
});

export const reset = () => ({
  type: ACTION_TYPES.RESET,
});
