import { PropertyTypePropertyType } from './property-type-property-type.model';

export interface FieldTypePropertyType {
  fieldTypeId?: number;
  propertyTypeId?: number;
  order?: number;
  propertyType?: PropertyTypePropertyType;
}
