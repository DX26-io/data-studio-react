import { Moment } from 'moment';

export interface IDatasources {
  id?: number;
  name?: string;
  lastUpdated?: Date;
  connectionName?: string;
  connectionId?:string;
  queryPath?: string;
  sql?: string;
}

export const defaultDatasourceValue: Readonly<IDatasources> = {
  id: null,
  name: '',
  lastUpdated: new Date(),
  connectionName: '',
  connectionId:null,
  queryPath: '',
  sql: '',
};
