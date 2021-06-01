import { FieldType } from './field-type.model';
import { MetadataVisualPropertyType } from './metadata-visual-property-type.model';

export interface MetadataVisual {
  id?: number;
  name?: string;
  icon?: string;
  customId?: number;
  functionname?: string;
  fieldTypes?: FieldType[];
  propertyTypes?: MetadataVisualPropertyType[];
}
