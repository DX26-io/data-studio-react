import { IRealm } from 'app/shared/model/realm.model';
export interface IFunction {
  readonly id: any;
  readonly description: string;
  readonly dimensionUse: boolean;
  readonly measureUse: boolean;
  readonly name: string;
  readonly realm: IRealm;
  readonly validation: string;
  readonly value: string;
}
