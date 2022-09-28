import { ORGANISATION_TYPE_ENTERPRISE, ORGANISATION_TYPE_FULL, AUTHORITIES } from 'app/config/constants';
import { debounce } from 'lodash';

/**
 * Extracts the first letters of two words in a text
 * @param stringText
 */
export const getFirstLettersFromString = (stringText: string): string => {
  const splitString = stringText.split(' ', 2);
  let finalString = '';
  if (splitString.length > 1) splitString.map(word => (finalString = finalString + word.charAt(0)));
  else finalString = splitString[0].slice(0, 2);
  return finalString.toUpperCase();
};

export const parseBool = str => {
  if (!str && str.length === 0) {
    return str === 1 ? true : false;
  } else {
    if (typeof str === 'boolean') {
      return str;
    } else {
      return str.toLowerCase() === 'true' ? true : false;
    }
  }
};

export const parseString = str => {
  if (str) {
    return str;
  } else {
    return '';
  }
};

export const isCanvas = () => {
  if (window.location.href.includes('build')) {
    return true;
  } else {
    return false;
  }
};

export const isRootUser = account => {
  return account.organisation.type === ORGANISATION_TYPE_FULL;
};

export const isSuperAdminUser = account => {
  return account.userGroups.includes(AUTHORITIES.SUPER_ADMIN);
};

export const isAdminUser = account => {
  return account.userGroups.includes(AUTHORITIES.ADMIN);
};

export const isUser = account => {
  return account.userGroups.includes(AUTHORITIES.USER);
};

export const isEnterpriseAndSuperadminUser = account => {
  return account.organisation.type === ORGANISATION_TYPE_ENTERPRISE && isSuperAdminUser(account);
};

export const debouncedSearch = debounce((callback, args) => {
  callback.apply(this, args);
}, 2000);
