import { IUserGroup } from 'app/shared/model/user-group.model';
import { IError } from 'app/shared/model/error.model';

const isValidName = (name: string) => {
  return name !== '';
};

export const isFormValid = (userGroup: IUserGroup): IError => {
  let error = { translationKey: '', isValid: true };
  if (!isValidName(userGroup.name)) {
    error = { translationKey: 'userGroup.error.name', isValid: false };
    return error;
  }
  return error;
};
