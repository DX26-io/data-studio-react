import { Moment } from 'moment';

export interface IDatasources {
  id?: number;
  name?: string;
  lastUpdated?: Date;
  connectionName?: string;
  queryPath?: string;
  sql?: string;
}

export const defaultDatasourceValue: Readonly<IDatasources> = {
  id: null,
  name: '',
  lastUpdated: new Date(),
  connectionName: '',
  queryPath: '',
  sql: '',
};
