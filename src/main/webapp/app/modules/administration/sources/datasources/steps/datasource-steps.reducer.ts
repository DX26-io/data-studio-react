import datasources from '../datasources';

export const ACTION_TYPES = {
  SELECT_CONNECTION_TYPE: 'datasourceSteps/SELECT_CONNECTION_TYPE',
  SELECT_CONNECTION: 'datasourceSteps/SELECT_CONNECTION',
  SET_CONNECTION: 'datasourceSteps/SET_CONNECTION',
  RESET: 'datasourceSteps/RESET',
  SET_DATASOURCE: 'datasources/SET_DATASOURCE',
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
    linkId: '',
    connectionParameters: { cacheEnabled: false, cachePurgeAfterMinutes: 0, refreshAfterTimesRead: 0, refreshAfterMinutes: 0 },
  },
  isConnectionSelected: false,
  datasource: { sql: '', name: '', queryPath: '', lastUpdated: new Date() },
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
        isConnectionSelected: true,
      };
    case ACTION_TYPES.SET_CONNECTION:
      return {
        ...state,
        connection: action.payload,
      };
    case ACTION_TYPES.SET_DATASOURCE:
      return {
        ...state,
        datasource: action.payload,
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
export const setConnection = connection => {
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

export const setDatasource = datasource => {
  return {
    type: ACTION_TYPES.SET_DATASOURCE,
    payload: datasource,
  };
};
