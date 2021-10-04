export interface IReportLineItem {
  visualisationId: any;
  visualisation: string;
  dimensions: Array<string>;
  measures: Array<string>;
}

export const reportLineItemDefaultValue: Readonly<IReportLineItem> = {
  visualisationId: '',
  visualisation: '',
  dimensions: [],
  measures: [],
};
