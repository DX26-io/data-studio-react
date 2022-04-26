import { IViews } from './views.model';
import { IVisualMetadata } from './visualmetadata.model';
import { IFeature } from './feature.model';

export interface IBroadcast {
  selectedFilters: {};
  saveSelectedFilter: {};
  applyFilter: {};
  alternateDimension: {};
  pagination: {};
  tableActivePage: number;
  visualmetadata: IVisualMetadata;
  view: IViews;
  setTableActivePage: {};
  applyAlternativeDimensionFilter:{}
  features:Array<IFeature>;
  defaultColorSet:Array<any>;
}
