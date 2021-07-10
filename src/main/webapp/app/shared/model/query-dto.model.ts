import { Field } from './field.model';

export interface IQueryDTO {
  conditionExpressions?: any;
  fields: Array<Field> | Array<any>;
  groupBy?: Array<any>;
  limit: number;
  orders?: Array<any>;
  distinct?: boolean;
}

export const defaultValue: Readonly<IQueryDTO> = {
  conditionExpressions: null,
  fields: [],
  groupBy: [],
  limit: 20,
  orders: [],
};
