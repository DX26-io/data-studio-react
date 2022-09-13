import { IOrganisation } from './organisation.model';

export interface IRealm {
  readonly name: string;
  readonly id: number;
  readonly isActive: boolean;
  readonly createdBy: string;
  readonly organisation : IOrganisation
  readonly realmOrganisation? : IOrganisation
}

export const defaultValue: Readonly<IRealm> = {
  name: '',
  id: 0,
  isActive: false,
  createdBy: '',
  organisation:null,
  realmOrganisation:null
};
