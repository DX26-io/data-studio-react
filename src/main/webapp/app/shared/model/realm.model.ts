import { IOrganisation } from './organisation.model';

export interface IRealm {
  readonly name: string;
  readonly id: any;
  readonly isActive: boolean;
  readonly createdBy: string;
  readonly organisation: IOrganisation;
  readonly realmOrganisation?: IOrganisation;
}

const defaultValue: Readonly<IRealm> = {
  name: '',
  id: null,
  isActive: false,
  createdBy: '',
  organisation: null,
  realmOrganisation: null,
};

export const getDefaultValues = () => {
  return Object.assign({}, defaultValue);
};
