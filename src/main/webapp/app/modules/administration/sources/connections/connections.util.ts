import { IConnectionType, defaultConnectionTypeValue } from 'app/shared/model/connection-type.model';
import { IConnection, connectionDefaultValue } from 'app/shared/model/connection.model';
import { IError, defaultValue } from 'app/shared/model/error.model';
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
      Number(connection.connectionParameters.refreshAfterTimesRead) === 0 ||
      Number(connection.connectionParameters.refreshAfterMinutes) === 0)
  ) {
    error = { translationKey: 'connections.error.cache', isValid: false };
  } else if (connection.name === '') {
    error = { translationKey: 'connections.error.name', isValid: false };
  }
  return error;
};
