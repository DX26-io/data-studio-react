export const findViewsPermissionsChanges = (viewsPermissions: any) => {
  const permissionChanges = [];

  if (viewsPermissions) {
    viewsPermissions.forEach(function (view) {
      view.info.permissionMetadata.forEach(function (permissionV) {
        if (permissionV.value !== undefined && permissionV.hasIt !== permissionV.value) {
          permissionChanges.push({
            id: permissionV.permission.stringValue,
            action: permissionV.hasIt ? 'ADD' : 'REMOVE',
          });
        }
      });
    });
  }
  return permissionChanges;
};

export const getSearchParam = (param, route) => {
  const params = new URLSearchParams(route);
  return params.get(param) ? params.get(param) : '';
};

export const generateDatasourcesOptions = datasources => {
  const options = [];
  datasources &&
    datasources.forEach(item => {
      options.push({ value: item.id, label: item.name });
    });
  return options;
};
export const generateFeatureNameOptions = featurs => {
  const options = [];
  featurs &&
    featurs.forEach(item => {
      options.push({ value: item.id, label: item.name });
    });
  return options;
};
