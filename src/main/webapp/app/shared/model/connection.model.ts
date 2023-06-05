import { cacheDefaultValue, ICache } from './cache.model';
export interface IConnection {
  readonly id: string;
  readonly name: string;
  readonly connectionUsername: string;
  readonly connectionPassword: string;
  readonly details: any;
  readonly connectionType: string;
  readonly connectionTypeId: number;
  readonly linkId: string;
  readonly connectionParameters: ICache;
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
