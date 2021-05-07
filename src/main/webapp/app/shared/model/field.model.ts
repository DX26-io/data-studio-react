import { Constraint } from '../util/visualization.constants';
import { Feature } from './Feature.model';
import { FieldType } from './field-type.model';
import { Property } from './property.model';
export interface Field {
  createdBy?: null;
  createdDate?: Date;
  lastModifiedBy?: null;
  lastModifiedDate?: Date;
  id?: number;
  properties?: Property[];
  fieldType?: FieldType;
  feature?: Feature;
  hierarchy?: null;
  constraint?: Constraint;
  order?: number;
}
