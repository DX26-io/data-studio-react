import { FeatureType } from '../util/visualisation.constants';
import { IDatasources, defaultDatasourceValue } from 'app/shared/model/datasources.model';

export interface IFeature {
  createdBy?: '';
  createdDate?: Date;
  lastModifiedBy?: '';
  lastModifiedDate?: Date;
  id?: any;
  name?: string;
  type?: string;
  functionId?: any;
  definition?: string;
  datasource?: IDatasources;
  featureType?: string;
  fields?: any[];
  favouriteFilter?: any;
  pin?: any;
  dateFilter?: any;
  featureCacheType?: any;
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
  functionId: '',
  definition: '',
  datasource: defaultDatasourceValue,
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
