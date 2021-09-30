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

export interface IReportLineItem {
  visualizationId: any;
  visualizationType: string;
  dimensions: Array<string>;
  measures: Array<string>;
}

export const reportLineItemDefaultValue: Readonly<IReportLineItem> = {
  visualizationId: '',
  visualizationType: '',
  dimensions: [],
  measures: [],
};

export interface IAssignReport {
  channels: Array<string>;
  communicationList: ICommunicationList;
}

export const communicationListDefaultValue: Readonly<ICommunicationList> = {
  emails: null,
  teams: [],
};

export const assignReportDefaultValue: Readonly<IAssignReport> = {
  channels: [],
  communicationList: communicationListDefaultValue,
};

export interface ICommunicationList {
  emails: Array<IEmail>;
  teams: Array<number>;
}

export interface IEmail {
  userEmail: string;
  userName: string;
}

export const emailDefaultValue: Readonly<IEmail> = {
  userEmail: '',
  userName: '',
};

export interface ISchedule {
  cronExp: string;
  timezone: string;
  startDate: Date;
  endDate: Date;
}

export const scheduleDefaultValue: Readonly<ISchedule> = {
  cronExp: '',
  timezone: '',
  startDate: new Date(),
  endDate: new Date(),
};

export interface ISchedulerReport {
  datasourceId: any;
  dashboardId: any;
  report: IReport;
  reportLineItem: IReportLineItem;
  assignReport: IAssignReport;
  schedule: ISchedule;
  queryDTO: any;
  //   query: any;
  constraints: any;
  putCall: boolean;
  emailReporter: boolean;
}

export const schedulerReportDefaultValue: Readonly<ISchedulerReport> = {
  datasourceId: '',
  dashboardId: '',
  report: reportDefaultValue,
  reportLineItem: reportLineItemDefaultValue,
  assignReport: assignReportDefaultValue,
  schedule: scheduleDefaultValue,
  queryDTO: {},
  //   query: any;
  constraints: {},
  putCall: false,
  emailReporter: false,
};
