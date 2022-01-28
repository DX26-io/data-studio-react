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

export const onFetchDatasourceConstraints = constraint => {
  if (constraint) {
    constraint['datasourceId'] = constraint.datasource.id;
    constraint['userGroupName'] = constraint.userGroup.name;
  }
  return constraint;
};
