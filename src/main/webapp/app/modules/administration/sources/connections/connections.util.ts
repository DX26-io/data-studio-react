import { IConnectionType, defaultConnectionTypeValue } from 'app/shared/model/connection-type.model';
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
