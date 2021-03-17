export interface IConnection {
  id: string;
  name: string;
  connectionUsername: string;
  connectionPassword: string;
  details: any;
  connectionType: string;
  connectionTypeId: number;
  linkId: string;
  connectionParameters: any;
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
  connectionParameters: { cacheEnabled: false, cachePurgeAfterMinutes: 0, refreshAfterTimesRead: 0, refreshAfterMinutes: 0 },
};
