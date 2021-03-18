import { translate } from 'react-jhipster';
import { IConnection } from 'app/shared/model/connection.model';
import { IConnectionType } from 'app/shared/model/connection-type.model';
import { IDatasources } from 'app/shared/model/datasources.model';

export const getSteps = () => {
  return [
    translate('datasources.steps.connectionType'),
    translate('datasources.steps.newDataConnection'),
    translate('datasources.steps.cacheSettings'),
    translate('datasources.steps.exploreDataModel'),
    translate('datasources.steps.dimensionsMeasures'),
  ];
};

export const getFeatureTypes = () => {
  return [{ name: 'DIMENSION' }, { name: 'MEASURE' }];
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

export const isNextDisabled = (
  connection: IConnection,
  connectionType: IConnectionType,
  datasource: IDatasources,
  isConnected: boolean,
  exploreModelTabId: number,
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
  } else if (
    ((exploreModelTabId === 1 && !datasource.name) || (exploreModelTabId === 2 && (!datasource.name || !datasource.sql))) &&
    step === 3
  ) {
    return true;
  } else {
    return false;
  }
};

export const generateDatasourcesOptions = (datasources = []) => {
  const options = [];
  datasources.forEach(function (datasource) {
    options.push({ value: datasource.sql ? datasource.sql : datasource.name, label: datasource.name });
  });
  return options;
};
