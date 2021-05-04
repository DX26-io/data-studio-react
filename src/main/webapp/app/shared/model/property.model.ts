import { Color, FieldType, PropertyTypePropertyType, ValueElement } from './field-type.model';

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
