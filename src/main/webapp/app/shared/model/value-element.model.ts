import { DataTypeEnum } from '../util/visualisation.constants';

export interface ValueElement {
  type?: DataTypeEnum;
  id?: number;
  value?: string;
}
