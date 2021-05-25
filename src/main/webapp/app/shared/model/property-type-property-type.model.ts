import { Color, DataTypeEnum, PropertyType } from '../util/visualization.constants';
import { ValueElement } from './value-element.model';

export interface PropertyTypePropertyType {
  type?: PropertyType;
  createdBy?: '';
  createdDate?: Date;
  lastModifiedBy?: '';
  lastModifiedDate?: Date;
  id?: number;
  name?: string;
  description?: string;
  possibleValues?: ValueElement[];
  defaultValue?: boolean | ValueElement | Color | number | null;
  dataType?: DataTypeEnum;
}
