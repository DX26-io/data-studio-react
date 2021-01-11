const getFormattedNumber = (value, format) => {
  switch (format) {
    case 'Actual':
      return value;
    case 'K':
      return value / 1000;
    case 'M':
      return value / 1000000;
    case 'B':
      return value / 1000000000;
    case 'Percent':
      return value;
    default:
      return value;
  }
};

const isFunction = obj => {
  return !!(obj && obj.constructor && obj.call && obj.apply);
};

const getDimensionsAndMeasures = fields => {
  const dimensions = fields
    .filter(function (item) {
      return item.feature && item.feature.featureType === 'DIMENSION';
    })
    .map(function (item) {
      const newItem = {};
      // angular.copy(item, newItem);
      //newItem.feature.name = newItem.feature.selectedName;
      return newItem;
    })
    .sort(function (a, b) {
      return sortBySequenceNumber(a.fieldType, b.fieldType);
    });

  const measures = fields
    .filter(function (item) {
      return item.feature && item.feature.featureType === 'MEASURE';
    })
    .map(function (item) {
      const newItem = {};
      //  angular.copy(item, newItem);
      //  newItem.feature.name = newItem.feature.name;
      return newItem;
    })
    .sort(function (a, b) {
      return sortBySequenceNumber(a.fieldType, b.fieldType);
    });
  return {
    measures: measures,
    dimensions: dimensions,
  };
};

const getDimensionsAndMeasuresForNotification = fields => {
  const dimensions = fields
    .filter(function (item) {
      return item.feature && item.feature.featureType === 'DIMENSION';
    })
    .map(function (item) {
      const newItem = {};
      //   angular.copy(item, newItem);
      //.feature.name = newItem.feature.name;
      return newItem;
    })
    .sort(function (a, b) {
      return sortBySequenceNumber(a.fieldType, b.fieldType);
    });

  const measures = fields
    .filter(function (item) {
      return item.feature && item.feature.featureType === 'MEASURE';
    })
    .map(function (item) {
      const newItem = {};
      //  angular.copy(item, newItem);
      // newItem.feature.name = newItem.feature.name;
      return newItem;
    })
    .sort(function (a, b) {
      return sortBySequenceNumber(a.fieldType, b.fieldType);
    });
  return {
    measures: measures,
    dimensions: dimensions,
  };
};

const getPropertyValue = (properties, propertyName, orElse) => {
  const _properties = properties.filter(function (item) {
    return item.propertyType.name === propertyName;
  });
  const property = _properties[0];

  if (!property) {
    if (isFunction(orElse)) {
      return orElse();
    } else {
      return orElse;
    }
  } else {
    if (property.value && property.value.value) {
      return property.value.value;
    } else {
      return property.value;
    }
  }
};

const setPropertyValue = (properties, propertyName, orElse) => {
  const _properties = properties.filter(function (item) {
    return item.propertyType.name === propertyName;
  });
  const property = _properties[0];
  if (property) {
    if (property.value && property.value.value) {
      property.value.value = 0;
    } else {
      property.value = 0;
    }
  }
};

const getFieldPropertyValue = (field, propertyName, orElse) => {
  return getPropertyValue(field.properties, propertyName, orElse);
};

/**
 * Normalize data according to given range
 *
 * @param {any} values array of values
 * @param {any} lowBoundry left side of interval
 * @param {any} highBoundry right side of interval
 * @param {any} x value to be normalized
 * @returns normalized value to given interval
 */
const normalize = (values, lowBoundry, highBoundry, x) => {
  const maxValue = values.reduce(function (a, b) {
    return Math.max(a, b);
  });

  const minValue = values.reduce(function (a, b) {
    return Math.min(a, b);
  });
  const xStd = (x - minValue) / (maxValue - minValue);

  return xStd * (highBoundry - lowBoundry) + lowBoundry;
};

const sortBySequenceNumber = (a, b) => {
  return a.order - b.order;
};

export const VisualizationUtils = () => {
  return {
    normalize: normalize,
    sortBySequenceNumber: sortBySequenceNumber,
    getFieldPropertyValue: getFieldPropertyValue,
    getPropertyValue: getPropertyValue,
    setPropertyValue: setPropertyValue,
    getDimensionsAndMeasures: getDimensionsAndMeasures,
    getFormattedNumber: getFormattedNumber,
    getDimensionsAndMeasuresForNotification: getDimensionsAndMeasuresForNotification,
  };
};
