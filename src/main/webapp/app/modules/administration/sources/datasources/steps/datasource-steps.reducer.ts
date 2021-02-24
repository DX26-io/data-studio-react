export const ACTION_TYPES = {
  SELECT_CONNECTION_TYPE: 'datasourceSteps/SELECT_CONNECTION_TYPE',
  SELECT_CONNECTION: 'datasourceSteps/SELECT_CONNECTION',
  UPDATE_CONNECTION: 'datasourceSteps/UPDATE_CONNECTION',
  RESET: 'datasourceSteps/RESET',
  BUILD_DATASOURCE: 'datasourceSteps/BUILD_DATASOURCE',
};

const initialState = {
  connectionType: {
    connectionPropertiesSchema: {
      connectionProperties: [],
      config: {},
    },
    id: '',
  },
  connection: {
    id: '',
    name: '',
    details: {},
    connectionType: '',
    connectionTypeId: 0,
    connectionParameters: { cacheEnabled: false, cachePurgeAfterMinutes: 0, refreshAfterTimesRead: 0, refreshAfterMinutes: 0 },
  },
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
    case ACTION_TYPES.UPDATE_CONNECTION:
      return {
        ...state,
        connection: action.payload,
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState,
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
export const updateConnection = connection => {
  return {
    type: ACTION_TYPES.UPDATE_CONNECTION,
    payload: connection,
  };
};
export const resetSteps = () => {
  return {
    type: ACTION_TYPES.RESET,
  };
};
