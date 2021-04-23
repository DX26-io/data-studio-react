export interface ICache {
  cacheEnabled: boolean;
  cachePurgeAfterMinutes: number;
  refreshAfterTimesRead: number;
  refreshAfterMinutes: number;
}

export const cacheDefaultValue: Readonly<ICache> = {
  cacheEnabled: false,
  cachePurgeAfterMinutes: 0,
  refreshAfterTimesRead: 0,
  refreshAfterMinutes: 0,
};
