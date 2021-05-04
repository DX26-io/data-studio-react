import { RealmDTO } from 'app/shared/model/realm.model';

export interface IFunction {
  readonly id: number;
  readonly description: string;
  readonly dimensionUse: boolean;
  readonly measureUse: boolean;
  readonly name: string;
  readonly realm: RealmDTO;
  readonly validation: string;
  readonly value: string;
}
