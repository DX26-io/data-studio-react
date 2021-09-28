import { IDropdown } from './scheduler';

export const updateEmail = (user: Array<IDropdown>) => {
  const userList = [];
  user.forEach(item => {
    userList.push({
      userEmail: item.label.split(' ')[1],
      userName: item.label.split(' ')[0],
    });
  });
  return userList;
};

export const updateWebhook = webhooks => {
  const webhooksList = [];
  webhooks.forEach(item => {
    webhooksList.push(Number(item.value));
  });
  return webhooksList;
};
