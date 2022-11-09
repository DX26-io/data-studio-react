import { IRealm } from './realm.model';
import { IOrganisation } from './organisation.model';
export interface IAccount {
  id: number;
  userGroups: Array<string>;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  langKey: string;
  currentRealm: IRealm;
  organisation: IOrganisation;
}
