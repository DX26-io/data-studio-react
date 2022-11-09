import { IUser } from 'app/shared/model/user.model';
import { IError, defaultValue } from 'app/shared/model/error.model';

const isValidLogin = (login: string) => {
  return login !== '' && login.length > 1 && login.length < 50;
};

const isEmailLengthValid = (email: string) => {
  return email !== '' && email.length < 100;
};

const isValidEmail = (email: string) => {
  // eslint-disable-next-line
  return email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
};

const isValidFirstName = (firstName: string) => {
  return firstName.length < 50;
};

const isValidLastName = (lastName: string) => {
  return lastName.length < 50;
};

export const isFormValid = (user: IUser): IError => {
  let error = defaultValue;
  if (!isValidLogin(user.login)) {
    error = { translationKey: 'userManagement.error.login', isValid: false };
    return error;
  } else if (!isEmailLengthValid(user.email)) {
    error = { translationKey: 'userManagement.error.emailLength', isValid: false };
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
};

export const getUserFullName = account => {
  return account.firstName + ' ' + account.lastName;
};

export const generateUsersOptions = users => {
  const options = [];
  users &&
    users.forEach(item => {
      options.push({ value: item.login, label: getUserFullName(item) });
    });
  return options;
};
