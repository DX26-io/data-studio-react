import { Constraint } from '../util/visualization.constants';
import { IFeature } from './feature.model';
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
  feature?: IFeature;
  hierarchy?: null;
  constraint?: Constraint;
  order?: number;
}
