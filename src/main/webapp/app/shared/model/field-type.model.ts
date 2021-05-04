import { Constraint } from './field.model';
import { PropertyType } from './property.model';

export interface FieldType {
  createdBy?: null;
  createdDate?: Date;
  lastModifiedBy?: null;
  lastModifiedDate?: Date;
  id?: number;
  constraint?: Constraint;
  order?: number;
  propertyTypes?: FieldTypePropertyType[];
  featureType?: FeatureType;
}

export enum FeatureType {
  Dimension = 'DIMENSION',
  Measure = 'MEASURE',
}

export interface FieldTypePropertyType {
  fieldTypeId?: number;
  propertyTypeId?: number;
  order?: number;
  propertyType?: PropertyTypePropertyType;
}

export interface PropertyTypePropertyType {
  type?: PropertyType;
  createdBy?: null;
  createdDate?: Date;
  lastModifiedBy?: null;
  lastModifiedDate?: Date;
  id?: number;
  name?: string;
  description?: string;
  possibleValues?: ValueElement[];
  defaultValue?: boolean | ValueElement | Color | number | null;
  dataType?: DataTypeEnum;
}

export enum DataTypeEnum {
  String = 'STRING',
}

export interface ValueElement {
  type?: DataTypeEnum;
  id?: number;
  value?: string;
}

export enum Color {
  Ffffff = '#FFFFFF',
  The617C8C = '#617c8c',
  The676A6C = '#676a6c',
}
