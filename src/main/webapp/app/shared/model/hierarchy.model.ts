import { IDrilldown } from './drilldown.model';
export interface IHierarchy {
  id?: any;
  name: string;
  drilldown: any;
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
};
