// import datasources from '../datasources';
import { IConnection, connectionDefaultValue } from 'app/shared/model/connection.model';
import { IDatasources, defaultDatasourceValue } from 'app/shared/model/datasources.model';
import { IConnectionType, defaultConnectionTypeValue } from 'app/shared/model/connection-type.model';
export const ACTION_TYPES = {
  SELECT_CONNECTION_TYPE: 'connectionSteps/SELECT_CONNECTION_TYPE',
  SELECT_CONNECTION: 'connectionSteps/SELECT_CONNECTION',
  SET_CONNECTION: 'connectionSteps/SET_CONNECTION',
  RESET: 'connectionSteps/RESET',
  IS_SAVE_CONNECTION: 'connectionSteps/IS_SAVE_CONNECTION',
  IS_CONNECTION_SELECTED: 'connectionSteps/IS_CONNECTION_SELECTED',
};

const initialState = {
  connectionType: defaultConnectionTypeValue,
  connection: connectionDefaultValue,
  isConnectionSelected: false,
  isAddFeaturesCalled: false,
  isSaveConnectionCalled: false,
};

export type ConnectionStepsState = Readonly<typeof initialState>;

export default (state: ConnectionStepsState = initialState, action): ConnectionStepsState => {
  switch (action.type) {
    case ACTION_TYPES.SELECT_CONNECTION_TYPE:
      return {
        ...state,
        connectionType: action.payload,
      };
    case ACTION_TYPES.SELECT_CONNECTION:
      return {
        ...state,
        connection: action.payload,
        isConnectionSelected: true,
      };
    case ACTION_TYPES.IS_CONNECTION_SELECTED:
      return {
        ...state,
        isConnectionSelected: action.payload,
      };
    case ACTION_TYPES.SET_CONNECTION:
      return {
        ...state,
        connection: action.payload,
      };
    case ACTION_TYPES.IS_SAVE_CONNECTION:
      return {
        ...state,
        isSaveConnectionCalled: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export const selectConnectionType = (connectionType: IConnectionType) => {
  return {
    type: ACTION_TYPES.SELECT_CONNECTION_TYPE,
    payload: connectionType,
  };
};
export const selectConnection = (connection: IConnection) => {
  return {
    type: ACTION_TYPES.SELECT_CONNECTION,
    payload: connection,
  };
};

export const setIsConnectionSelected = isConnectionSelected => {
  return {
    type: ACTION_TYPES.IS_CONNECTION_SELECTED,
    payload: isConnectionSelected,
  };
};

export const setConnection = (connection: IConnection) => {
  return {
    type: ACTION_TYPES.SET_CONNECTION,
    payload: connection,
  };
};
export const resetSteps = () => {
  return {
    type: ACTION_TYPES.RESET,
  };
};

export const setIsSaveConnectionCalled = isSaveConnectionCalled => {
  return {
    type: ACTION_TYPES.IS_SAVE_CONNECTION,
    payload: isSaveConnectionCalled,
  };
};
