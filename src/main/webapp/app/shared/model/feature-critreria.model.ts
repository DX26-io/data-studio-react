import { IFeature, defaultValue as featureDefaultValue } from 'app/shared/model/feature.model';
export interface IFeatureCriteria {
  dateRange: boolean;
  feature: IFeature;
  id: any;
  metaData: any;
  value: string;
}
export const defaultValue: Readonly<IFeatureCriteria> = {
  dateRange: false,
  feature: featureDefaultValue,
  id: '',
  metaData: null,
  value: '',
};
