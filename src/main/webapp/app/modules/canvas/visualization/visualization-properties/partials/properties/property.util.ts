export const generateAlternativeDimensionsOptions = data => {
  const options = [];
  if (data) {
    const _data = JSON.parse(data);
    _data.forEach(function (option) {
      options.push({ value: option['featureID'], label: option['featureName'] });
    });
  }
  return options;
};

export const generateFeaturesOptions = data => {
  const options = [];
  if (data) {
    data.forEach(function (option) {
      options.push({ value: option['id'], label: option['name'] });
    });
  }
  return options;
};
