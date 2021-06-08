export interface IReportLineItem {
  visualizationId: any;
  visualization: string;
  dimensions: Array<string>;
  measures: Array<string>;
}

export const reportLineItemDefaultValue: Readonly<IReportLineItem> = {
  visualizationId: '',
  visualization: '',
  dimensions: [],
  measures: [],
};
