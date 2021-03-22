import { IConnectionPropertiesSchema, defaultConnectionPropertiesSchemaValue } from './connection-properties-schema';
export interface IConnectionType {
  id?: number;
  connectionPropertiesSchema: IConnectionPropertiesSchema;
  isSelected: boolean;
}

export const defaultConnectionTypeValue: Readonly<IConnectionType> = {
  id: null,
  connectionPropertiesSchema: defaultConnectionPropertiesSchemaValue,
  isSelected: false,
};
