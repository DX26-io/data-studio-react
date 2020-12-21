export interface IFeature {
  id?: number;
  datasourceId?: number;
  dateFilter?: string;
  definition?: string;
  favouriteFilter?: boolean;
  featureCacheType?: string;
  featureType?: string;
  functionId?: number;
  isSelected?: boolean;
  name?: string;
  pin?: boolean;
  type?: string;
}

export const defaultValue: Readonly<IFeature> = {
  favouriteFilter: false,
  isSelected: false,
  pin: false,
};
