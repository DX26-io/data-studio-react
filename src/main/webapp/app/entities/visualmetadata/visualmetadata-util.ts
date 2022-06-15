import { IViews } from 'app/shared/model/views.model';
import { IPayload, IPayloadResult } from 'react-jhipster';

export declare type ICrudPutActionVisual<T> = (data?: T, view?: IViews, filter?: any) => IPayload<T> | IPayloadResult<T>;

export const addFieldMeasure = (visualWrap, visual) => {
  const fieldType = visualWrap.nextFieldMeasure(visual.fields, visual.metadataVisual);
  let field = null;
  if (fieldType) {
    field = {
      fieldType,
      feature: null,
      constraint: fieldType.constraint,
      properties: fieldType.propertyTypes.map(function (item) {
        return {
          propertyType: item.propertyType,
          value: item.propertyType.defaultValue,
          type: item.propertyType.type,
          order: item.order,
        };
      }),
      order: fieldType.order,
    };
  }
  return field;
};

export const addFieldDimension = (visualWrap, visual) => {
  const fieldType = visualWrap.nextFieldDimension(visual.fields, visual.metadataVisual);
  let field = null;
  if (fieldType) {
    field = {
      fieldType,
      feature: null,
      constraint: fieldType.constraint,
      properties: fieldType.propertyTypes.map(function (item) {
        return {
          propertyType: item.propertyType,
          value: item.propertyType.defaultValue,
          type: item.propertyType.type,
          order: item.order,
        };
      }),
      order: fieldType.order,
    };
  }
  return field;
};

export const isFeatureExist = (fields, draggedFeature) => {
  const features = fields.filter(function (item) {
    return item.feature != null && item.feature.definition === draggedFeature.definition;
  });
  return features.length > 0 ? false : true;
};

export const isDefaultFeatureEmpty = (fields, type) => {
  const features = fields.filter(function (item) {
    return item.fieldType.featureType === type && item.feature === null;
  });
  return features.length === 0 ? true : false;
};
