import { IDatasourceConstraints } from 'app/shared/model/datasource-constraints.model';
import { IError, defaultValue } from 'app/shared/model/error.model';
import { IFeature } from 'app/shared/model/feature.model';

export const isFormValid = (constraint: IDatasourceConstraints): IError => {
  let error = defaultValue;
  if (!constraint.datasource.id) {
    error = { translationKey: 'permissions.datasourceConstraints.error.datasource', isValid: false };
    return error;
  } else if (!constraint.user.id) {
    error = { translationKey: 'permissions.datasourceConstraints.error.user', isValid: false };
    return error;
  } else if (!constraint.constraintDefinition.featureConstraints[0]['@type']) {
    error = { translationKey: 'permissions.datasourceConstraints.error.type', isValid: false };
    return error;
  } else if (!constraint.constraintDefinition.featureConstraints[0].featureName) {
    error = { translationKey: 'permissions.datasourceConstraints.error.feature', isValid: false };
    return error;
  } else if (constraint.constraintDefinition.featureConstraints[0].values.length === 0) {
    error = { translationKey: 'permissions.datasourceConstraints.error.filter', isValid: false };
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
