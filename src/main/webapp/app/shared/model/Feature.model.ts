export interface Feature {
  createdBy?: null;
  createdDate?: Date;
  lastModifiedBy?: null;
  lastModifiedDate?: Date;
  id?: number;
  name?: string;
  type?: string;
  functionId?: null;
  definition?: string;
  datasource?: null;
  featureType?: FeatureType;
  fields?: any[];
  favouriteFilter?: null;
  pin?: null;
  dateFilter?: null;
  featureCacheType?: null;
}

export enum FeatureType {
  Dimension = 'DIMENSION',
  Measure = 'MEASURE',
}
