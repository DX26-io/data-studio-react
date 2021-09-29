export const SetDefaultWebHookList = (webHookList, webhook) => {
  const options = [];
  webhook?.forEach(element => {
    const data = webHookList?.find(x => x.id === element);
    if (data) {
      options.push({ value: data.id.toString(), label: data.webhookName });
    }
  });
  return options;
};
export const SetDefaulSelectedUserEmailList = (userList, userEmails) => {
  const options = [];
  userEmails?.forEach(element => {
    const data = userList?.find(x => `${x.login} ${x.email}` === `${element.userName} ${element.userEmail}`);
    if (data) {
      options.push({ value: `${data.login} ${data.email}`, label: `${data.login} ${data.email}` });
    }
  });
  return options;
};

export const GenerateWebhookOptions = data => {
  const options = [];
  data.forEach(element => {
    options.push({ value: element.id.toString(), label: element.webhookName });
  });
  return options;
};

export const GenerateUserOptions = data => {
  const options = [];
  data.forEach(element => {
    options.push({ value: `${element.login} ${element.email}`, label: `${element.login} s${element.email}` });
  });
  return options;
};
