import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';

// TODO : account model will be created by sergei so putting any for now
export const isAdmin = (account: any) => {
  return hasAnyAuthority(account.userGroups, [AUTHORITIES.ADMIN]);
};

// TODO : account model will be created by sergei so putting any for now
export const findUserId = (account: any, searchedUser: string) => {
  return isAdmin(account) ? searchedUser : account.login;
};
