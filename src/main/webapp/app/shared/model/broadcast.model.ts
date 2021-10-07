import { IViews } from './views.model';
import { IVisualMetadata } from './visual-meta-data.model';

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
}
