import { IViews } from './views.model';
import { IVisualMetadata } from './visual-meta-data.model';

export interface IBroadcast {
  selectedFilters: {};
  saveSelectedFilter: {};
  applyFilter: {};
  alternateDimension: {};
  visualmetadata: IVisualMetadata;
  view: IViews;
}
