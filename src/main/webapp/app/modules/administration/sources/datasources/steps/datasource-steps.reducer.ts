export const ACTION_TYPES = {
  SELECT_CONNECTION_TYPE: 'connections/SELECT_CONNECTION_TYPE',
  SELECT_CONNECTION: 'connections/SELECT_CONNECTION',
  RESET: 'connections/RESET',
  BUILD_DATASOURCE: 'connections/BUILD_DATASOURCE',
};

const initialState = {
  connectionType: null,
  connection: null,
  disabledDataConnection: false,
};

export type DatasourceStepsState = Readonly<typeof initialState>;

export default (state: DatasourceStepsState = initialState, action): DatasourceStepsState => {
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
        disabledDataConnection: true,
      };
    case ACTION_TYPES.RESET:
      return {
        connectionType: null,
        connection: null,
        disabledDataConnection: false,
      };
    default:
      return state;
  }
};

export const selectConnectionType = connectionType => {
  return {
    type: ACTION_TYPES.SELECT_CONNECTION_TYPE,
    payload: connectionType,
  };
};
export const selectConnection = connection => {
  return {
    type: ACTION_TYPES.SELECT_CONNECTION,
    payload: connection,
  };
};

export const reset = () => {
  return {
    type: ACTION_TYPES.SELECT_CONNECTION,
  };
};
