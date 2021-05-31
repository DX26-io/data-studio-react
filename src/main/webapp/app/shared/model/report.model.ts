export interface IReport {
  userId: any;
  connectionName: string;
  reportName: string;
  sourceId: any;
  subject: string;
  titleName: string;
  mailBody: string;
  dashboardName: string;
  viewName: string;
  viewId: any;
  shareLink: string;
  buildUrl: string;
  thresholdAlert: false;
  createdDate?: string;
}

export const reportDefaultValue: Readonly<IReport> = {
  userId: '',
  connectionName: '',
  reportName: '',
  sourceId: 0,
  subject: '',
  titleName: '',
  mailBody: '',
  dashboardName: '',
  viewName: '',
  viewId: '',
  shareLink: '',
  buildUrl: '',
  thresholdAlert: false,
  createdDate: '',
};
