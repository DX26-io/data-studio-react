import { FeatureType } from '../util/visualization.constants';

export interface IFeature {
  createdBy?: null;
  createdDate?: Date;
  lastModifiedBy?: null;
  lastModifiedDate?: Date;
  id?: any;
  name?: string;
  type?: string;
  functionId?: null;
  definition?: string;
  datasource?: null;
  featureType?: string;
  fields?: any[];
  favouriteFilter?: null;
  pin?: null;
  dateFilter?: null;
  featureCacheType?: null;
  metadata: any;
  selected: string;
  selected2: string;
}

export const defaultValue: Readonly<IFeature> = {
  createdBy: null,
  createdDate: new Date(),
  lastModifiedBy: null,
  lastModifiedDate: new Date(),
  id: '',
  name: '',
  type: '',
  functionId: null,
  definition: '',
  datasource: null,
  featureType: '',
  fields: [],
  favouriteFilter: null,
  pin: null,
  dateFilter: null,
  featureCacheType: null,
  metadata: {},
  selected: '',
  selected2: '',
};
