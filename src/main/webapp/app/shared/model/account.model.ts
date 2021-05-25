import { IRealm } from './realm.model';
import { IUserGroup } from './user-group.model';
export interface IAccount {
  id: number;
  userGroups: Array<string>;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  langKey: string;
  currentRealm: IRealm;
}
