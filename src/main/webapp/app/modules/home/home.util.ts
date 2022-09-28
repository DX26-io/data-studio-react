import { isAdminUser, isEnterpriseAndSuperadminUser, isRootUser, isUser } from 'app/shared/util/common-utils';

export const getTabs = account => {
  let tabs = [];
  if (isRootUser(account)) {
    tabs = [
      { id: 1, name: 'home.top.tabs.quickStart.title' },
      { id: 2, name: 'home.top.tabs.admin' },
      // this is commented for time being { id: 3, name: 'home.top.tabs.superAdmin' },
      { id: 4, name: 'home.top.tabs.root' },
    ];
  } else if (isEnterpriseAndSuperadminUser(account)) {
    tabs = [
      { id: 1, name: 'home.top.tabs.quickStart.title' },
      { id: 2, name: 'home.top.tabs.admin' },
      { id: 3, name: 'home.top.tabs.superAdmin' },
    ];
  } else if (isAdminUser(account)) {
    tabs = [
      { id: 1, name: 'home.top.tabs.quickStart.title' },
      { id: 2, name: 'home.top.tabs.admin' },
    ];
  } else if (isUser(account)) {
    tabs = [{ id: 1, name: 'home.top.tabs.quickStart.title' }];
  }
  return tabs;
};
