import { IUserGroup } from 'app/shared/model/user-group.model';
import { IError, defaultValue } from 'app/shared/model/error.model';

const isValidName = (name: string) => {
  return name !== '';
};

export const isFormValid = (userGroup: IUserGroup): IError => {
  let error = defaultValue;
  if (!isValidName(userGroup.name)) {
    error = { translationKey: 'userGroups.error.name', isValid: false };
    return error;
  }
  return error;
};
