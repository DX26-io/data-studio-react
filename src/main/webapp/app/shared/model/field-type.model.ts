import { Constraint, FeatureType } from '../util/visualization.constants';
import { FieldTypePropertyType } from './field-type-property-type.model';
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
