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
  thresholdAlert: boolean;
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
  thresholdAlert: true,
  createdDate: '',
};

export interface IReportLineItem {
  visualizationId: any;
  visualisationType: string;
  dimensions: Array<string>;
  measures: Array<string>;
}

export const reportLineItemDefaultValue: Readonly<IReportLineItem> = {
  visualizationId: '',
  visualisationType: '',
  dimensions: [],
  measures: [],
};

export interface IAssignReport {
  channels: Array<string>;
  communicationList: ICommunicationList;
}

export const communicationListDefaultValue: Readonly<ICommunicationList> = {
  emails: [],
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
  cronExp: '10 4 11 * *',
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
  constraints: string;
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
  constraints: '{}',
  putCall: false,
  emailReporter: false,
};
export interface ICondition {
  thresholdMode: string;
  dynamicThreshold: any;
  featureName?: any;
  value?: any;
  compare: {
    value: any;
  };
}

export const ConditionDefaultValue: Readonly<ICondition> = {
  thresholdMode: 'Absolute',
  compare: {
    value: '',
  },
  dynamicThreshold: {},
};
export interface IConstraints {
  time: {
    featureName: string;
    value?: number;
    unit: string;
  };
}

export const ConstraintsDefaultValue: Readonly<IConstraints> = {
  time: {
    featureName: '',
    unit: '',
  },
};

export interface ITimeConditions {
  unit?: {
    value: string;
  };
  featureName?: string;
  value?: number;
  feature?: {
    definition: any;
  };
}

export const TimeConditionsDefaultValue: Readonly<ITimeConditions> = {
  feature: {
    definition: {},
  },
};
