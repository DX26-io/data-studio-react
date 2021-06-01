let account;
export const getPermissions = () => {
  return account.permissions;
};

export const hasAuthority = authority => {
  if (account?.permissions && account?.permissions.indexOf(authority) !== -1) {
    return true;
  } else {
    return false;
  }
};

export const saveAccount = accountDTO => {
  account = accountDTO;
};

export const getAccount = () => {
  return account;
};

export const isAdmin = () => {
  if (account.userGroups && account.userGroups.indexOf('ROLE_ADMIN') > -1) {
    return true;
  } else {
    return false;
  }
};
