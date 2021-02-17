import { IFeature } from './feature.model';

export interface IVisualMetadata {
  readOnly?: boolean;
  _id?: string;
  _rev?: string;
  visualMetadataSet?: IVisualMetadataSet[];
}

export interface IVisualMetadataSet {
  createdBy?: null;
  createdDate?: Date;
  lastModifiedBy?: null;
  lastModifiedDate?: Date;
  height?: number;
  width?: number;
  xPosition?: number;
  yPosition?: number;

  w?: number;
  x?: number;
  h?: number;
  y?: number;

  data?: any;

  conditionExpression?: null;
  query?: null;
  queryJson?: null;
  titleProperties?: TitleProperties;
  bodyProperties?: BodyProperties;
  metadataVisual?: MetadataVisual;
  properties?: Property[];
  fields?: Field[];
  isCardRevealed?: boolean;
  isSaved?: boolean;
  id?: string;
}

export interface BodyProperties {
  backgroundColor?: string;
  border?: string;
  opacity?: number;
}

export interface Field {
  createdBy?: null;
  createdDate?: Date;
  lastModifiedBy?: null;
  lastModifiedDate?: Date;
  id?: number;
  properties?: Property[];
  fieldType?: FieldType;
  feature?: IFeature;
  hierarchy?: null;
  constraint?: Constraint;
  order?: number;
}

export enum Constraint {
  Optional = 'OPTIONAL',
  Required = 'REQUIRED',
}

export interface Feature {
  createdBy?: null;
  createdDate?: Date;
  lastModifiedBy?: null;
  lastModifiedDate?: Date;
  id?: number;
  name?: string;
  type?: string;
  functionId?: null;
  definition?: string;
  datasource?: null;
  featureType?: FeatureType;
  fields?: any[];
  favouriteFilter?: null;
  pin?: null;
  dateFilter?: null;
  featureCacheType?: null;
}

export enum FeatureType {
  Dimension = 'DIMENSION',
  Measure = 'MEASURE',
}

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

export enum PropertyType {
  Checkbox = 'CHECKBOX',
  ColorPicker = 'COLOR_PICKER',
  Number = 'NUMBER',
  Select = 'SELECT',
  Text = 'TEXT',
}

export interface Property {
  type?: PropertyType;
  createdBy?: null;
  createdDate?: Date;
  lastModifiedBy?: null;
  lastModifiedDate?: Date;
  id?: null;
  propertyType?: PropertyTypePropertyType;
  order?: number;
  value?: boolean | ValueElement | Color | number | null | string;
}

export interface MetadataVisual {
  id?: number;
  name?: string;
  icon?: string;
  customId?: number;
  functionname?: string;
  fieldTypes?: FieldType[];
  propertyTypes?: MetadataVisualPropertyType[];
}

export interface MetadataVisualPropertyType {
  id?: ID;
  propertyType?: PropertyTypePropertyType;
  order?: number;
}

export interface ID {
  visualizationId?: number;
  propertyTypeId?: number;
}

export interface TitleProperties {
  titleText?: string;
  backgroundColor?: string;
  borderBottom?: string;
  color?: string;
}

export const defaultValue: Readonly<IVisualMetadataSet> = {};
