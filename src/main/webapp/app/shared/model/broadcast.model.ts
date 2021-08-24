import { IViews } from './views.model';
import { IVisualMetadata } from './visual-meta-data.model';

export interface IBroadcast {
  selectedFilters: {};
  saveSelectedFilter: {};
  applyFilter: {};
  visualmetadata: IVisualMetadata;
  view: IViews;
}
