import { Moment } from 'moment';

export interface IDatasources {
  id?: number;
  name?: string;
  lastUpdated?: Date;
  connectionName?: string;
  queryPath?: string;
}

export const defaultValue: Readonly<IDatasources> = {};
