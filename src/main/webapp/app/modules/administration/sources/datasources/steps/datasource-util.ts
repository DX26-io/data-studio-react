import { translate } from 'react-jhipster';

export const SELECT_CONNECTION_PLACEHOLDER = translate('datasources.dataConnection.selectConnectionPlaceholder');
export const CONFIGURE_DATABASE_SERVER_LABEL = translate('datasources.dataConnection.configDatabaseServer');
export const SERVER_ADDRESS_LABEL = translate('datasources.dataConnection.serverAddress');
export const PORT_LABEL = translate('datasources.dataConnection.port');
export const DATABASE_NAME_LABEL = translate('datasources.dataConnection.databaseName');
export const USERNAME_LABEL = translate('datasources.dataConnection.userName');
export const PASSWORD_LABEL = translate('datasources.dataConnection.password');
export const TEST_CONNECTION_LABEL = translate('datasources.dataConnection.testConnection');
export const CONNECTION_NAME_LABEL = translate('datasources.dataConnection.connectionName');

export const getSteps = () => {
  return [
    translate('datasources.steps.connectionType'),
    translate('datasources.steps.newDataConnection'),
    translate('datasources.steps.cacheSettings'),
    translate('datasources.steps.exploreDataModel'),
    translate('datasources.steps.dimensionsMeasures'),
  ];
};

export const prepareConnection = (connection, connectionType) => {
  const con = connection;
  con.connectionType = connectionType.name;
  con.connectionTypeId = connectionType.id;
  con.connectionType = connectionType.name;
  con.connectionParameters = connection.connectionParameters;
  con.details['@type'] = connectionType.connectionPropertiesSchema.connectionDetailsType;
  return con;
};

export const isNextDisabled = () => {};
