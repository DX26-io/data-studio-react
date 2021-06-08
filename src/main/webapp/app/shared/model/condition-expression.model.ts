export interface IConditionExpression {
  '@type': string;
  firstExpression: any;
  identifier: string;
  metadata: string;
  secondExpression: any;
  uuid: string;
  expression: {
    '@type': string;
    comparatorType: string;
  };
  featureName: string;
  valueTypes: Array<any>;
  values: Array<any>;
}
