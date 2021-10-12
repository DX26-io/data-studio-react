import { IConnectionType, defaultConnectionTypeValue } from 'app/shared/model/connection-type.model';
import { IConnection, connectionDefaultValue } from 'app/shared/model/connection.model';
import { IError, defaultValue } from 'app/shared/model/error.model';
import { translate } from 'react-jhipster';
import { IDatasources } from 'app/shared/model/datasources.model';

export const onFeaturesFetched = (result: any) => {
  const features = [];
  const metaData = result.metadata;
  const data = result.data[0];
  Object.keys(metaData).forEach(function (key) {
    features.push({
      name: key,
      featureType: typeof data[key] === 'string' || data[key] instanceof String ? 'DIMENSION' : 'MEASURE',
      type: metaData[key],
      isSelected: true,
    });
  });
  return features;
};

export const onConnectionTypeFetched = (result: Array<IConnectionType>) => {
  const connectionTypes = [];
  result.forEach(function (item) {
    item.isSelected = false;
    connectionTypes.push(item);
  });
  return connectionTypes;
};

export const setIsSelectedConnectionType = (result: Array<IConnectionType>, id: number) => {
  const connectionTypes = [];
  result.forEach(function (item) {
    if (item.id !== id) {
      item.isSelected = false;
    }
    connectionTypes.push(item);
  });
  return connectionTypes;
};

export const isFormValid = (connection: IConnection): IError => {
  let error = defaultValue;
  if (
    connection.connectionParameters.cacheEnabled &&
    (Number(connection.connectionParameters.cachePurgeAfterMinutes) === 0 ||
      connection.connectionParameters.cachePurgeAfterMinutes === undefined ||
      Number(connection.connectionParameters.refreshAfterTimesRead) === 0 ||
      connection.connectionParameters.refreshAfterTimesRead === undefined ||
      Number(connection.connectionParameters.refreshAfterMinutes) === 0 ||
      connection.connectionParameters.refreshAfterMinutes === undefined)
  ) {
    error = { translationKey: 'connections.error.cache', isValid: false };
  } else if (connection.name === '') {
    error = { translationKey: 'connections.error.name', isValid: false };
  }
  return error;
};

export const getSteps = () => {
  return [
    translate('connections.steps.connectionType'),
    translate('connections.steps.newDataConnection'),
    translate('connections.steps.cacheSettings'),
  ];
};

export const isNextDisabled = (
  connection: IConnection,
  connectionType: IConnectionType,
  isConnected: boolean,
  step: number
) => {
  if (connectionType.id === null && step === 0) {
    return true;
  } else if (!isConnected && step === 1) {
    return true;
  } else if (!connection.connectionParameters.cacheEnabled && step === 2) {
    return false;
  } else if (
    (Number(connection.connectionParameters.cachePurgeAfterMinutes) === 0 ||
      Number(connection.connectionParameters.refreshAfterTimesRead) === 0 ||
      Number(connection.connectionParameters.refreshAfterMinutes) === 0) &&
    step === 2
  ) {
    return true;
  }
};

export const generateConnectionsOptions = connections => {
  const options = [];
  connections.forEach(function (item) {
    options.push({ value: item.id, label: item.name });
  });
  return options;
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

