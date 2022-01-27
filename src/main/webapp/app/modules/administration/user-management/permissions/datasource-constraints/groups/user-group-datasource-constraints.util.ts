import { IUserGroupDatasourceConstraints } from 'app/shared/model/user-group-datasource-constraints.model';
import { IError, defaultValue } from 'app/shared/model/error.model';

export const isFormValid = (constraint: IUserGroupDatasourceConstraints): IError => {
  let error = defaultValue;
  if (!constraint?.datasource && !constraint.datasourceId) {
    error = { translationKey: 'permissions.datasourceConstraints.error.datasource', isValid: false };
    return error;
  } else if (!constraint.constraintDefinition.featureConstraints[0].id) {
    error = { translationKey: 'permissions.datasourceConstraints.error.feature', isValid: false };
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
