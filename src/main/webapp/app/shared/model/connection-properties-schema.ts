export interface IConnectionPropertiesSchema {
  connectionProperties?: Array<any>;
  config: any;
}

export const defaultConnectionPropertiesSchemaValue: Readonly<IConnectionPropertiesSchema> = {
  connectionProperties: [],
  config: {},
};
