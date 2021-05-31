import { communicationListDefaultValue, ICommunicationList } from './communication-list.model';

export interface IAssignReport {
  channels: Array<string>;
  communicationList: ICommunicationList;
}

export const assignReportDefaultValue: Readonly<IAssignReport> = {
  channels: [],
  communicationList: communicationListDefaultValue,
};
