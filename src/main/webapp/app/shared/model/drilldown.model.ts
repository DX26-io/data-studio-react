import { IFeature } from './feature.model';
export interface IDrilldown {
  order: number;
  feature: IFeature;
}

export const defaultValue: Readonly<IDrilldown> = {
  order: 0,
  feature: null,
};
