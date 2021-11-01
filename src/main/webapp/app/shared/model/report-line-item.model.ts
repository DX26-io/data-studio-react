export interface IReportLineItem {
  visualizationId: any;
  visualisation: string;
  dimensions: Array<string>;
  measures: Array<string>;
}

export const reportLineItemDefaultValue: Readonly<IReportLineItem> = {
  visualizationId: '',
  visualisation: '',
  dimensions: [],
  measures: [],
};
