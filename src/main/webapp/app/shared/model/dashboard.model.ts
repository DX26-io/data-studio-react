import { Moment } from 'moment';
import { IDatasources } from './datasources.model';

export interface IDashboard {
  id?: number;
  dashboardName?: string;
  category?: string;
  description?: string;
  published?: boolean;
  image_location?: string;
  image_content_type?: string;
  dashboard_datasource_id?: number;
  created_by?: string;
  created_date?: string;
  last_modified_by?: string;
  lastModifiedDate?: string;
  current_release_id?: number;
  dashboardDatasource?: IDatasources;
}

export const defaultValue: Readonly<IDashboard> = {
  published: false,
  dashboardName: '',
  category: '',
  description: '',
  dashboardDatasource: {},
};
