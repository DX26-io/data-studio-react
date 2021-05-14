import { Constraint } from 'app/shared/util/visualization.constants';

export const createFields = (newVM: any) => {
  const order = 0;
  newVM.fields = newVM.metadataVisual.fieldTypes
    .filter(function (item) {
      return item.constraint === Constraint.Required;
    })
    .map(function (item) {
      return {
        fieldType: item,
        feature: null,
        constraint: item.constraint,
        properties: item.propertyTypes,
      };
    });
  newVM.fields.forEach(function (field) {
    field.fieldType = field.fieldType;
    field.order = order + 1;
    field.properties = field.fieldType.propertyTypes.map(function (item) {
      return {
        propertyType: item.propertyType,
        value: item.propertyType.defaultValue,
        type: item.propertyType.type,
        order: item.order,
      };
    });
  });

  return newVM;
};

export const createProperties = (newVM: any) => {
  newVM.properties = newVM.metadataVisual.propertyTypes.map(function (item) {
    return {
      propertyType: item.propertyType,
      value: item.propertyType.defaultValue,
      order: item.order,
      type: item.propertyType.type,
    };
  });
  return newVM;
};
