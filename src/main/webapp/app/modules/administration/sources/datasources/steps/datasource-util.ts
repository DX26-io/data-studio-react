import { translate } from 'react-jhipster';
import { IDatasources } from 'app/shared/model/datasources.model';

export const getSteps = () => {
  return [translate('datasources.steps.exploreDataModel'), translate('datasources.steps.dimensionsMeasures')];
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

export const isNextDisabled = (datasource: IDatasources, exploreModelTabId: number, step: number) => {
  if (((exploreModelTabId === 1 && !datasource.name) || (exploreModelTabId === 2 && (!datasource.name || !datasource.sql))) && step === 0) {
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

export const generateConnectionsOptions = connections => {
  const options = [];
  connections.forEach(function (item) {
    options.push({ value: item.id, label: item.name });
  });
  return options;
};

export const isShowDataButtonDisabled = datasource => {
  const x = datasource.name === null || datasource.name === '';
  return datasource.name === null || datasource.name === '';
};
