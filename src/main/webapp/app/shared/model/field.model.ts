import { Constraint } from '../util/visualisation.constants';
import { IFeature } from './feature.model';
import { FieldType } from './field-type.model';
import { Property } from './property.model';
export interface Field {
  createdBy?: '';
  createdDate?: Date;
  lastModifiedBy?: '';
  lastModifiedDate?: Date;
  id?: number;
  properties?: Property[];
  fieldType?: FieldType;
  feature?: IFeature;
  hierarchy?: any;
  constraint?: Constraint;
  order?: number;
}
