import { assignReportDefaultValue, IAssignReport } from './assign-report.model';
import { IReportLineItem, reportLineItemDefaultValue } from './report-line-item.model';
import { IReport, reportDefaultValue } from './report.model';
import { ISchedule, scheduleDefaultValue } from './schedule.model';

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
  putcall: boolean;
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
  putcall: false,
  emailReporter: false,
};
