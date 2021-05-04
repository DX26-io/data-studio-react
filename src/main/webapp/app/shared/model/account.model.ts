export interface IAccount {
  activated: boolean;
  email: string;
  firstName: string;
  langKey: string;
  lastName: string;
  login: string;
  permissions: Array<string>;
  realm: { id: number; name: string };
  userGroups: Array<string>;
  userType: string;
}
export const defaultValue: Readonly<IAccount> = {
  activated: false,
  email: '',
  firstName: '',
  langKey: '',
  lastName: '',
  login: '',
  permissions: [],
  realm: { id: 0, name: '' },
  userGroups: [],
  userType: '',
};
