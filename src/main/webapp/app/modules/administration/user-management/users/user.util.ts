import { IUser, defaultValue } from 'app/shared/model/user.model';

const isValidLogin = (login: string) => {
  return login !== '' && login.length > 1 && login.length < 50;
};

const isValidEmail = (email: string) => {
  return email !== '' && email.length < 100;
};

const isValidFirstName = (firstName: string) => {
  return firstName.length < 50;
};

const isValidLastName = (lastName: string) => {
  return lastName.length < 50;
};

export const isFormValid = (user: IUser): any => {
  let error = { translationKey: '', isValid: true };
  if (!isValidLogin(user.login)) {
    error = { translationKey: 'userManagement.error.login', isValid: false };
    return error;
  } else if (!isValidEmail(user.email)) {
    error = { translationKey: 'userManagement.error.email', isValid: false };
    return error;
  } else if (!isValidFirstName(user.firstName)) {
    error = { translationKey: 'userManagement.error.firstName', isValid: false };
    return error;
  } else if (!isValidLastName(user.lastName)) {
    error = { translationKey: 'userManagement.error.lastName', isValid: false };
    return error;
  }
  return error;
  // below is required in near future hence commented it
  // return isValidLogin(user.login) || isValidEmail(user.email) || isValidFirstName(user.firstName) || isValidLastName(user.lastName);
};
