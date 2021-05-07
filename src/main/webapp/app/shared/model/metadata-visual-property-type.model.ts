import { ID } from './id.model';
import { PropertyTypePropertyType } from './property-type-property-type.model';

export interface MetadataVisualPropertyType {
  id?: ID;
  propertyType?: PropertyTypePropertyType;
  order?: number;
}
