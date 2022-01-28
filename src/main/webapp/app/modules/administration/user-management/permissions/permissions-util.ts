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

export const resetConstraint = (constraint, condition) => {
  constraint.constraintDefinition.featureConstraints[0] = condition;
  return Object.assign({}, constraint);
};

export const updateConditionInConstraint = (constraint, condition) => {
  const index = constraint.constraintDefinition.featureConstraints.indexOf(condition);
  if (index > -1) {
    constraint.constraintDefinition.featureConstraints[index] = condition;
  }
  return Object.assign({}, constraint);
};

export const removeConstraintFromList = (constraint, condition) => {
  const index = constraint.constraintDefinition.featureConstraints.indexOf(condition);
  if (index > -1) {
    constraint.constraintDefinition.featureConstraints.splice(index, 1);
  }
  return Object.assign({}, constraint);
};

export const addConstraintIntoList = (constraint, conditionDefaultValue) => {
  constraint.constraintDefinition.featureConstraints.push(conditionDefaultValue);
  return Object.assign({}, constraint);
};
