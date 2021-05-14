import { COMPARABLE_DATA_TYPES } from 'app/shared/util/data-constraints.constants';
import { translate } from 'react-jhipster';

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

const getFilterPropertyValue = (property, orElse) => {
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
const getPropertyValue = (properties, propertyName, orElse) => {
  const filterProperty = properties.filter(function (item) {
    return item.propertyType.name === propertyName;
  });
  const property = filterProperty[0];

  return getFilterPropertyValue(property, orElse);
};

const setPropertyValue = (properties, propertyName: string, orElse) => {
  const filterProperty = properties.filter(function (item) {
    return item.propertyType.name === propertyName;
  });
  const property = filterProperty[0];
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

const getMaxValue = values => {
  return values.reduce(function (a, b) {
    return Math.max(a, b);
  });
};

const getMinValue = values => {
  return values.reduce(function (a, b) {
    return Math.min(a, b);
  });
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
  const maxValue = getMaxValue(values);
  const minValue = getMinValue(values);
  const xStd = (x - minValue) / (maxValue - minValue);
  return xStd * (highBoundry - lowBoundry) + lowBoundry;
};

const sortBySequenceNumber = (a, b) => {
  return a.order - b.order;
};

/**
 * This method returns an object that contains dashboard form labels
 */
export const getVisualizationFromTranslations = (): any => {
  return {
    SelectDimension: translate('datastudioApp.visualmetadata.SelectDimension'),
    SelectMeasure: translate('datastudioApp.visualmetadata.SelectMeasure'),
  };
};

export const checkIsDateType = dimension => {
  const dataType = dimension.type;
  const isDateType = COMPARABLE_DATA_TYPES.includes(dataType.toLowerCase());
  return isDateType;
};

export const getDimension = (features, dimension) => {
  return features.find(element => {
    return element.name === dimension;
  });
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
