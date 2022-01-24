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
