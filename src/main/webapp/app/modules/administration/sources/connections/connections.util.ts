export const onFeaturesFetched = result => {
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
