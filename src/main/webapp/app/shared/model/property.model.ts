import { Color, PropertyType } from '../util/visualization.constants';
import { PropertyTypePropertyType } from './property-type-property-type.model';
import { ValueElement } from './value-element.model';
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
