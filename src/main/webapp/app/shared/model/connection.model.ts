export interface IConnection {
  id: string;
  name: string;
  details: any;
  connectionType: string;
  connectionTypeId: number;
  linkId: string;
  connectionParameters: any;
}

export const defaultValue: Readonly<IConnection> = {
  id: '',
  name: '',
  details: {},
  connectionType: '',
  connectionTypeId: 0,
  linkId: '',
  connectionParameters: { cacheEnabled: false, cachePurgeAfterMinutes: 0, refreshAfterTimesRead: 0, refreshAfterMinutes: 0 },
};
