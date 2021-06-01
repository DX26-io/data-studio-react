import { Color, PropertyType } from '../util/visualization.constants';
import { PropertyTypePropertyType } from './property-type-property-type.model';
import { ValueElement } from './value-element.model';
export interface Property {
  type?: PropertyType;
  createdBy?: '';
  createdDate?: Date;
  lastModifiedBy?: '';
  lastModifiedDate?: Date;
  id?: any;
  propertyType?: PropertyTypePropertyType;
  order?: number;
  value?: boolean | ValueElement | Color | number | null | string;
}
