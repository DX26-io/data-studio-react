import { cacheDefaultValue, ICache } from './cache.model';
export interface IConnection {
  id: string;
  name: string;
  connectionUsername: string;
  connectionPassword: string;
  details: any;
  connectionType: string;
  connectionTypeId: number;
  linkId: string;
  connectionParameters: ICache;
}

export const connectionDefaultValue: Readonly<IConnection> = {
  id: '',
  name: '',
  connectionUsername: '',
  connectionPassword: '',
  details: {},
  connectionType: '',
  connectionTypeId: 0,
  linkId: '',
  connectionParameters: cacheDefaultValue,
};
