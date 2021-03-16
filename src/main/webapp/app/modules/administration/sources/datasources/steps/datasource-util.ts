import { translate } from 'react-jhipster';

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

export const isNextDisabled = (connection: any, connectionType: any, isConnected: boolean, step: number) => {
  if (connectionType.id === '' && step === 0) {
    return true;
  } else if (connection.name === '' && isConnected === false && step === 1) {
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
