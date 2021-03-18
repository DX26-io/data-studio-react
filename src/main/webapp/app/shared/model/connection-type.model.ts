import { IConnectionPropertiesSchema, defaultConnectionPropertiesSchemaValue } from './connection-properties-schema';
export interface IConnectionType {
  id?: number;
  connectionPropertiesSchema: IConnectionPropertiesSchema;
}

export const defaultConnectionTypeValue: Readonly<IConnectionType> = {
  id: null,
  connectionPropertiesSchema: defaultConnectionPropertiesSchemaValue,
};
