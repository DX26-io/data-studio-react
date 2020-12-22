import { Moment } from 'moment';
import { IDashboard } from './dashboard.model';

export interface IViews {
  id?: number;
  viewName?: string;
  description?: string;
  createdBy?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: Date | null;
  published?: boolean;
  imageContentType?: string;
  imageLocation?: string;
  image?: any;
  viewDashboard?: IDashboard;
}

export const defaultValue: Readonly<IViews> = {
  published: false,
};
