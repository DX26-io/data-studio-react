import { IEmail } from './email.model';

export interface ICommunicationList {
  emails: Array<IEmail>;
  teams: Array<number>;
}

export const communicationListDefaultValue: Readonly<ICommunicationList> = {
  emails: null,
  teams: [],
};
