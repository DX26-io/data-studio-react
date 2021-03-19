export interface ISchedule {
  datasourceid?: number;
  report?: IReport;
  dashboardId?: string;
  report_line_item?: {
    visualizationid?: string;
    visualization?: string;
    dimension?: string[];
    measure?: string[];
  };
  queryDTO?: any;
  assign_report?: {
    channel?: string[];
    communication_list?: { email?: IEmail[]; teams?: number[] };
  };
  schedule?: {
    cron_exp?: string;
    timezone?: string;
    start_date?: Date | null;
    end_date?: Date | null;
  };
  constraints?: any;
  putcall?: boolean;
  emailReporter?: boolean;
}

export interface IReport {
  userid?: string;
  connection_name?: string;
  report_name?: string;
  source_id?: number;
  subject?: string;
  title_name?: string;
  mail_body?: string;
  dashboard_name?: string;
  view_name?: string;
  view_id?: number;
  share_link?: string;
  build_url?: string;
  thresholdAlert?: boolean;
}

export interface IEmail {
  user_name?: string;
  user_email?: string;
}

export const defaultValue: Readonly<ISchedule> = {};
