import { IError, defaultValue } from 'app/shared/model/error.model';
import { IHierarchy } from 'app/shared/model/hierarchy.model';

export const isFormValid = (hierarchy: IHierarchy): IError => {
  let error = defaultValue;
  if (!hierarchy.name) {
    error = { translationKey: 'hierarchies.error.name', isValid: false };
    return error;
  } else if (hierarchy.drilldown.length < 2) {
    error = { translationKey: 'hierarchies.error.drilldownLength', isValid: false };
    return error;
  } else if (hierarchy.drilldown.length >= 2) {
    hierarchy.drilldown.forEach(function (item) {
      if (item.feature === null) {
        error = { translationKey: 'hierarchies.error.feature', isValid: false };
      }
    });
    return error;
  }
  return error;
};

export const generateFeaturesOptions = features => {
  const options = [];
  features.forEach(function (item) {
    if (item.featureType === 'DIMENSION') {
      options.push({ value: item.id, label: item.name });
    }
  });
  return options;
};
