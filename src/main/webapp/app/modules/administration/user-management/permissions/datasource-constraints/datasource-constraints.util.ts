import { IDatasourceConstraints } from 'app/shared/model/datasource-constraints.model';
import { IError, defaultValue } from 'app/shared/model/error.model';

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

export const generateUserOptions = users => {
  const options = [];
  users &&
    users.forEach(item => {
      options.push({ value: item.id, label: item.login });
    });
  return options;
};
export const generateDatasourcesOptions = datasources => {
  const options = [];
  datasources &&
    datasources.forEach(item => {
      options.push({ value: item.id, label: item.name });
    });
  return options;
};
export const generateFeatureNameOptions = featurs => {
  const options = [];
  featurs &&
    featurs.forEach(item => {
      options.push({ value: item.id, label: item.name });
    });
  return options;
};
