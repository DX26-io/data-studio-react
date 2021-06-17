import { IDrilldown } from './drilldown.model';
import { IDatasources, defaultDatasourceValue } from './datasources.model';
export interface IHierarchy {
  id?: any;
  name: string;
  drilldown: any;
  datasource: IDatasources;
}

export const defaultValue: Readonly<IHierarchy> = {
  id: '',
  name: '',
  drilldown: [
    {
      feature: null,
      order: 0,
    },
    {
      feature: null,
      order: 1,
    },
  ],
  datasource: defaultDatasourceValue,
};
