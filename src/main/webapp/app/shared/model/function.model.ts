import { RealmDTO } from 'app/shared/model/realm.model';

export interface IFunction {
  id: number;
  description: string;
  dimensionUse: boolean;
  measureUse: boolean;
  name: string;
  realm: RealmDTO;
  validation: string;
  value: string;
}
