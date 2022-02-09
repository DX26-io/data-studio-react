import { Constraint } from '../util/visualisation.constants';
import { IFeature, defaultValue as featureDefaultValue } from './feature.model';
import { FieldType } from './field-type.model';
import { Property } from './property.model';
import { IHierarchy,defaultValue as hierarchyDefaultValue } from './hierarchy.model';
export interface Field {
  createdBy?: '';
  createdDate?: Date;
  lastModifiedBy?: '';
  lastModifiedDate?: Date;
  id?: number;
  properties?: Property[];
  fieldType?: FieldType;
  feature?: IFeature;
  hierarchy?: IHierarchy;
  constraint?: Constraint;
  order?: number;
}

export const defaultValue: Readonly<Field> = {
  createdBy: '',
  createdDate: new Date(),
  lastModifiedBy: '',
  lastModifiedDate: new Date(),
  id: 0,
  properties: [],
  fieldType: null,
  feature: featureDefaultValue,
  hierarchy: hierarchyDefaultValue,
  constraint: null,
  order: 0,
};
