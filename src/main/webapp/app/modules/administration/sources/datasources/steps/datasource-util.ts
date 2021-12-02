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

export const onMetaDataFetched = (featuresMetaData: any) => {
  const features = [];
  const metaData = featuresMetaData.metadata;
  const data = featuresMetaData.data[0];
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

export const onFeaturesFetched = (features, featuresMetaData) => {
  let _features = [];
  if (features && features.length > 0) {
    features.forEach(item => {
      if (Object.prototype.hasOwnProperty.call(featuresMetaData.metadata, item.name)) {
        item.isSelected = item.isSelected === null || item.isSelected ? true : false;
        _features.push(item);
      }
    });
  } else {
    _features = onMetaDataFetched(featuresMetaData);
  }
  return _features;
};
